import { Dimensions } from "react-native";

export default function scale(val, type){
    const parentHeight = 667;
    const parentWidth =  375;

    if(type == 0){
        const relative = Dimensions.get('window').width;
        return val * (relative/parentWidth);
    }

    relative = Dimensions.get('window').height;
    return val * (relative/parentHeight);
}