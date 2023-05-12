import { Directive, HostBinding, Input } from '@angular/core';


type WnlButtonType = 'primary' | 'secondery' | 'warning'
@Directive({
    selector: '[app-button]'
})
export class AppButton {
    private _type:WnlButtonType = "primary"
    private _selected = false;

    @Input('app-button') 
    public get type(): WnlButtonType {
        return this._type;
    }

    public set type (val: WnlButtonType) {
        this._type = val;
        
        switch(this._type) {
            case 'primary':
                this.className += ' bg-primary text-white hover:bg-primary-hover'
                break;
            case 'secondery':
                this.className += ' bg-secondery hover:bg-secondery-hover'
                break;
            case "warning":
                this.className += ' bg-warning text-white hover:bg-warning-hover'
                break;

        }
    }

    @Input('wnl-selected') 
    public get selected(): boolean {
        return this._selected;
    }

    public set selected (val: boolean) {
        this._selected = val;
        
        if(this._selected){
            switch(this._type) {
                case 'primary':
                    this.className = this.className.replace("bg-primary", "bg-primary-selected")
                    break;
                case 'secondery':
                    this.className = this.className.replace("bg-secondery", "bg-secondery-selected")
                    break;
            }
        } else {
            switch(this._type) {
                case 'primary':
                    this.className = this.className.replace("bg-primary-selected", "bg-primary")
                    break;
                case 'secondery':
                    this.className = this.className.replace("bg-secondery-selected", "bg-secondery")
                    break;
            }
        }
    }

    @HostBinding('class')
    className = 'rounded-full py-2 px-5';
}