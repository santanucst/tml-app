import { FormControl } from '@angular/forms';

export class UserValidators{
    static cannotContainSpace(control : FormControl){
        if(control.value.indexOf(' ')>=0)
            return{ cannotContainSpace : true};
        return null;

    }
}