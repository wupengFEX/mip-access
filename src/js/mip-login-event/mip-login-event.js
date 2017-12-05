(function () {
    var login = document.querySelector('#login');
    login.onclick = function (e) {
        e.preventDefault();

        var param = window.location.search;
        param = param.slice(1);
        var paramArr = param.split('&');
        for (key in paramArr) {
            var params = paramArr[key].split('=');
            if (params[0] === 'returnUrl') {
                fetch('https://www.mipengine.org/samples-templates/mip-access/mip-login-done').then(function (res) {
                    if (res.ok) {
                        window.location.replace(decodeURIComponent(params[1]));
                    }
                });
                break;
            }
        };
    }
})();
