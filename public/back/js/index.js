$(function () {
    // 柱状图
    var myChart = echarts.init(document.querySelector(".table_left"));

    var option = {
        title: {
            text: '2017年注册人数'
        },
        tooltip: {},
        legend: {
            data: ['人数']
        },
        xAxis: {
            data: ["1月", "2月", "3月", "4月", "5月", "6月"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [1000, 1499, 800, 2000, 1300, 1600]
        }]
    };
    myChart.setOption(option);
    // 饼状图
    var myCharts = echarts.init(document.querySelector('.table_right'));
    option1 = {
        title: {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['阿迪', '耐克', '李宁', '乔丹', '安踏']
        },
        series: [{
            name: '销售情况',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                    value: 335,
                    name: '阿迪'
                },
                {
                    value: 310,
                    name: '耐克'
                },
                {
                    value: 234,
                    name: '李宁'
                },
                {
                    value: 135,
                    name: '乔丹'
                },
                {
                    value: 1548,
                    name: '安踏'
                }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myCharts.setOption(option1);
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

})