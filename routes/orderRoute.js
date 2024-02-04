const express = require('express');
const { createOrder, updateOrder, getOwnOrders,getOrdersAcceptedByPacker, getAllOrders, getNotAcceptedOrders, getOwnSingleOrderDetails, acceptOrder, updateTrackingStatus, sendStripeApiKey, sendStripeSecretKey } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizedRole } = require('../middlewares/auth');

const router = express.Router();

router.route('/order/create/:uid').post(createOrder);
router.route('/order/:id/accept').post(isAuthenticatedUser, acceptOrder); //packer
router.route('/order/:id/update-tracking').post(isAuthenticatedUser, updateTrackingStatus); //packer
router.route('/order/:id/details').get(getOwnSingleOrderDetails);
router.route('/orders/:id').get(getOwnOrders);
router.route('/orders/not-accepted').get(isAuthenticatedUser, getNotAcceptedOrders); //packer and admin
router.route('/orders').get(getAllOrders);
router.route('/orders/accepted/:uid').get(isAuthenticatedUser, getOrdersAcceptedByPacker);


module.exports = router;