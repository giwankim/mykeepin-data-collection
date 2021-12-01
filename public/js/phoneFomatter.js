function phoneFomatter(num, type) {
    var formatNum = '';
    if (num.length == 11) {
        if (type == 0) {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    } else if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {
        if (num.indexOf('02') == 0) {
            if (type == 0) {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            } else if(num.length==9){
                formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
            }else{
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        } else {
            if (type == 0) {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            } else {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        }
    }
    return formatNum;
}