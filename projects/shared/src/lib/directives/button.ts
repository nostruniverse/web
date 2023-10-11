import { Directive, HostBinding, Input } from '@angular/core';


type ButtonType = 'primary' | 'secondery' | 'warning'
type ButtonShape = "button" | "pill"

@Directive({
    selector: '[ui-button]'
})
export class Button {
    private _type:ButtonType = "primary"
    private _selected = false;
    private _shape!: ButtonShape;

    @Input('ui-button') 
    public get type(): ButtonType {
        return this._type;
    }

    @Input("ui-shape")
    public get shape(): ButtonShape {
        return this._shape;
    }

    public set shape(val: ButtonShape) {
        this._shape = val;
        switch(this._shape){
            case "button":
                this.className += " rounded-md";
                break;
            case 'pill':
                this.className = this.className.replace("rounded-md", "rounded-full")
                break;
        }
    }

    public set type (val: ButtonType) {
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

    @Input('ui-selected') 
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
    className = 'py-2 px-5';

    constructor(){
        this.shape = "button";
    }
}