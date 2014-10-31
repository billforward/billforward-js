(function() {
    var bfjs = {};
    bfjs.stripe = {};

    bfjs.loadScript = function(url, callback){

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback(this);
                }
            };
        } else {  //Others
            script.onload = function(){
                callback(this);
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    bfjs.stripe.do = function(callee) {
        console.log(callee);
    };

    bfjs.addPaymentMethodToAccount = function(formElement) {
        //console.log(jQuery);
        this.loadScript("https://js.stripe.com/v2/", this.stripe.do);
    };

    window.bfjs = window.bfjs || bfjs;
}());