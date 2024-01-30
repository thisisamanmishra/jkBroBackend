const express = require('express');
const { createOrder, updateOrder, getOwnOrders,getOrdersAcceptedByPacker, getAllOrders, getNotAcceptedOrders, getOwnSingleOrderDetails, acceptOrder, updateTrackingStatus, sendStripeApiKey, sendStripeSecretKey } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizedRole } = require('../middlewares/auth');

const router = express.Router();

router.route('/order/create').post(isAuthenticatedUser, createOrder);
router.route('/order/:id/accept').post(isAuthenticatedUser, acceptOrder); //packer
router.route('/order/:id/update-tracking').post(isAuthenticatedUser, updateTrackingStatus); //packer
router.route('/order/:id/details').get(isAuthenticatedUser, getOwnSingleOrderDetails);
router.route('/orders').get(isAuthenticatedUser, getOwnOrders);
router.route('/orders/not-accepted').get(isAuthenticatedUser, getNotAcceptedOrders); //packer and admin
router.route('/orders/all').get(isAuthenticatedUser, authorizedRole("admin"), getAllOrders);
router.route('/orders/accepted/:uid').get(isAuthenticatedUser, getOrdersAcceptedByPacker);


module.exports = router;