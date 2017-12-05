(function () {
	var dismiss = document.getElementById('dismiss');
	dismiss.onclick = function () {
        var rid = localStorage.getItem('mip-access');
        rid = rid ? rid : '';
		fetch('https://www.mipengine.org/samples-templates/mip-access/dismiss?rid=' + rid).then(function (res) {
            if (res.ok) {
                dismiss.textContent = '重置成功';
            } else {
            	dismiss.textContent = '请求失败了，再重试一次吧！';
            }
        }).catch(function (err) {
            dismiss.textContent = '请求失败了，再重试一次吧！';
        });
	}
})();
