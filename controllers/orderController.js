const Order = require('../models/order');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
// const Razorpay = require('razorpay');

// Create a new instance of Razorpay with your Razorpay key credentials
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });

// new booking

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const { dates, amount, orderTime, movingFrom, movingTo, distance, payment, orderCompletion, tracking, furniture, appliances, cartoons,singleLayerPacking,multiLayerPacking,  carpenterCharges,
    tvMounting,
    acInstallation,
    acUninstallation,  } = req.body;

  

   // Assuming totalPrice is calculated based on your logic
   const totalPrice = req.body.amount; // Change this line based on your logic

//    // Create a new Razorpay order
//    const razorpayOrder = await razorpay.orders.create({
//      amount: totalPrice * 100, // Razorpay expects the amount in paise
//      currency: 'INR', // Change the currency code as needed
//    });

//   if (dates.length < 1) {
//     return next(new ErrorHandler('Please insert booking dates', 400));
//   }

if (!dates || dates.length === 0) {
    return next(new ErrorHandler('Please insert booking dates', 400));
  }




  await Order.create({
    dates, 
    amount,
    orderTime, 
    movingTo,
    movingFrom, 
    distance, 
    user: req.user.uid, 
    payment, 
    orderCompletion, 
    tracking, 
    furniture, 
    appliances, 
    cartoons,
    singleLayerPacking,
    multiLayerPacking,
    carpenterCharges,
    tvMounting,
    acInstallation,
    acUninstallation,
    // razorpayOrderId: razorpayOrder.id,
  })

  res.status(201).json({
    success: true
  });
});



// update booking status -- admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const status = req.body.orderCompletion;

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    if (status === 'Completed') {
        if (order.orderCompletion === "Completed") {
            return next(new ErrorHandler("Can't change order status", 400));
        }

        if (status === 'Completed') {
            if (order.orderCompletion === "Completed") {
                return next(new ErrorHandler("Can't change order status", 400));
            }
        
        
            // generate invoice, notify user
            order.orderCompletion = status;
            await order.save();
        }
        
        if (status === "Processing" || status === "Approved") {
            if (order.orderCompletion === "Completed") {
                return next(new ErrorHandler("Can't change order status", 400));
            }
        
            // Send notifications, schedule tasks, perform checks
            order.orderCompletion = status;
            await order.save();
        }
        

        order.orderCompletion = status;
        await order.save();

        const orders = await Order.find();

        res.status(200).json({
        success: true,
        orders
    });
    }

   
});




// Get details for a particular order for the authenticated user
exports.getOwnSingleOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    const userId = req.user.id; // Assuming you are using authentication middleware to get the user ID

    const order = await Order.findOne({ '_id': orderId, 'user': userId });

    if (!order) {
        return next(new ErrorHandler("Order not found or access denied", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// get own all bookings
exports.getOwnOrders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.uid; // Assuming you are using authentication middleware to get the user ID

    const orders = await Order.find({ 'user': userId });

    res.status(200).json({
        success: true,
        orders
    });
});

// get all notAccepted bookings
exports.getNotAcceptedOrders = catchAsyncErrors(async (req, res, next) => {
    const uid = req.user.uid; // Assuming you are using Firebase Authentication to get the UID

    const notAcceptedOrders = await Order.find({
        'user': uid,
        'acceptedBy': { $exists: false }, // Check if 'acceptedBy' field does not exist
    });

    res.status(200).json({
        success: true,
        notAcceptedOrders
    });
});
// accept and update tracking of orders by packers
exports.acceptOrder = catchAsyncErrors(async (req, res, next) => {
    const packerUid = req.user.uid; // Assuming you are using Firebase Authentication for packers

    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        // Check if the order is not already accepted
        if (order.acceptedBy) {
            return next(new ErrorHandler('Order already accepted', 400));
        }

        // Update the order to mark it as accepted by the packer
        order.acceptedBy = packerUid;
        order.tracking.push({
            status: 'Processing', // Initial tracking status when accepting the order
            timestamp: Date.now(),
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order accepted successfully',
            order,
        });
    } catch (error) {
        return next(new ErrorHandler('Error accepting order', 500));
    }
});

exports.updateTrackingStatus = catchAsyncErrors(async (req, res, next) => {
    const packerUid = req.user.uid; // Assuming you are using Firebase Authentication for packers

    const orderId = req.params.id;
    const newTrackingStatus = req.body.newStatus;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        // Check if the current packer is the one who accepted the order
        if (order.acceptedBy !== packerUid) {
            return next(new ErrorHandler('Unauthorized: You did not accept this order', 401));
        }

        // Update the tracking status
        order.tracking.push({
            status: newTrackingStatus,
            timestamp: Date.now(),
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Tracking status updated successfully',
            order,
        });
    } catch (error) {
        return next(new ErrorHandler('Error updating tracking status', 500));
    }
});




// Get all orders with their details
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const allOrders = await Order.find().populate('user');

    res.status(200).json({
        success: true,
        orders: allOrders
    });
});

// get all orders accepted by a particular packer -- admin and packer
exports.getOrdersAcceptedByPacker = catchAsyncErrors(async (req, res, next) => {
    const packerUid = req.params.uid; // Get packer UID from request parameters


    try {
        const packer = await packer.findOne({ uid: packerUid });

        if (!packer) {
            return next(new ErrorHandler('Packer not found', 404));
        }

        // Populate orders accepted by the packer along with user details
        const ordersAcceptedByPacker = await Order.find({ 'acceptedBy': packer._id })
                                                  .populate('user');

        res.status(200).json({
            success: true,
            packer,
            orders: ordersAcceptedByPacker
        });
    } catch (error) {
        next(error);
    }
});


