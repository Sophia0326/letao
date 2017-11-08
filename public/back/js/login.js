$(function () {
    // 验证表单
    // 1.用户名和密码不能为空
    // 2.用户名和密码有误
    // 3.密码长度

    // 获取表单
    var $form = $('form');
    // 调用bootstrapValidator校验表单
    $form.bootstrapValidator({
        // 配置校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 规则
        fields:{
            // 用户名校验
            username:{
                // username的所有校验规则
                validators:{
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    callback:{
                        message:"用户名错误"
                    }
                }
            },
            // 密码校验
            password:{
                // 规则
                validators:{
                    // 为空验证
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    // 长度验证
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度为6-12位"
                    },
                    callback:{
                        message:"密码错误验证"
                    }
                }
            }
        }
    });
    // 给表单一个校验成功事件 success.form.bv
    $form.on("success.form.bv",function(e){
        // 阻止默认行为
        e.preventDefault();
        // 使用ajax发送登录请求
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$form.serialize(),
            success:function(data){
                // 如果数据验证成功,跳转到首页
                console.log(data)
                if(data.success){
                    location.href = 'index.html';
                }
                if(data.error == 1000){
                    $form.data('bootstrapValidator').updataStatus('username','INVALID','callback')
                }
                if(data.error == 1001){
                    $form.data('bootstrapValidator').updataStatus('username','INVALID','callback')
                }
            }
        })
    })
    // 表单重置功能
    $('[type="reset"]').on('click',function(){
        $form.data("bootstrapValidator").resetForm();
    })
});