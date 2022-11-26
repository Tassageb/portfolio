var elements = {};

export default class Elements{
    static add(key, val){
        elements[key] = val;
    }

    static fetch(){
        return elements;
    }
}