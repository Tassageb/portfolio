class AntiSpam{
    constructor(maxTry, timeout) {
        this.attemps = {};
        this.maxTry = maxTry;
        this.timeout = timeout;
    }


    verifyIP(ip){
        if (!this.attemps[ip]){
            this.attemps[ip] = {count : 0, timer : setTimeout(() => {delete this.attemps[ip]}, this.timeout)}
        }

        if (this.attemps[ip].count <= this.maxTry){
            clearTimeout(this.attemps[ip].timer);
            this.attemps[ip].timer = setTimeout(() => {delete this.attemps[ip]}, this.timeout);

            return true;
        } else {
            return false;
        }
    }

    addCount(ip){
        this.attemps[ip].count++;
    }
}

module.exports = AntiSpam;