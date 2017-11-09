$(function () {

    // 点击菜单按钮,左侧边栏收起
    $('.btn_menu').on('click', function () {
        $('.lt_aside').toggleClass('hidden_l');
        $('.rt_aside').toggleClass('hidden_r');
    })
    // 点击分类管理,显示隐藏子分类
    $('.child').prev().on('click', function () {
        $(this).next().slideToggle();
    })

    // 弹出框提示是否退出首页
    $('.btn_confirm').on('click', function () {
        $.ajax({
            url: '/employee/employeeLogout',
            success: function (data) {
                // 判断success为true的时候,跳转到登录页
                if (data.success) {
                    location.href = "login.html";
                }
            }
        })
    })

    // 判断是否为登录状态
    if (location.href.indexOf("login.html") == -1){
        $.ajax({
            url:'/employee/checkRootLogin',
            success:function (data) {
                if(data.error === 400){
                    location.href = "login.html";
                }
            }
        })
    }
})