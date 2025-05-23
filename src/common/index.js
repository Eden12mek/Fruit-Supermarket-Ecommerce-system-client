const backendDomin = "http://localhost:5000"

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    addAdminEmployee: {
    url: `${backendDomin}/api/add-admin-employee`,
    method: "post"
},
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allRole : {
         url : `${backendDomin}/api/all-role`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "PATCH"
    },
    deleteUser : {
        url : `${backendDomin}/api/delete-user`,
        method  : 'post'
    },
    allCategory : {
        url : `${backendDomin}/api/get-category`,
        method : 'get'
    },
    addCategory : {
        url : `${backendDomin}/api/add-category`,
        method : 'post'
    },
    updateCategory : {
        url : `${backendDomin}/api/update-category`,
        method : 'post'
    },
    deleteCategory : {
        url : `${backendDomin}/api/delete-category`,
        method : 'post'
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    getProductByCategory : {
        url : `${backendDomin}/api/get-product-by-category`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    deleteProduct : {
        url : `${backendDomin}/api/delete-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    },
   paymentInitiate: {
        url: `${backendDomin}/api/initiate`, // Changed from /api/initiate to /api/payment/initiate
        method: 'post'
    },
    paymentConfirm: {
        url: `${backendDomin}/api/confirm`,
        method: 'post'
    },
    paymentCallback: {
        url: `${backendDomin}/api/callback`,
        method: 'post'
    },
    getAllPayments: {
        url: `${backendDomin}/api/all-payments`,
        method: 'get'
    },
     approvePayment: {
        url: `${backendDomin}/api/approve`,
        method: 'PATCH'
    },
    messageCreate: {
        url: `${backendDomin}/api/create-message`,
        method: 'post'
    },
    getAllmessage: {
        url: `${backendDomin}/api/all-messages`,
        method: 'get'
    },
     messageDelete: {
        url: `${backendDomin}/api/delete-message`,
        method: 'delete'
    },
     getNotifications: {
        url: `${backendDomin}/api/notifications`,
        method: 'get'
    },
}

export default SummaryApi