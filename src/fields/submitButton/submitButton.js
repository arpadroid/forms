import { Button } from '@arpadroid/ui';
import { defineCustomElement } from '@arpadroid/tools';
class SubmitButton extends Button {
    // static get observedAttributes() {
    //     return ['text'];
    // }
    // connectedCallback() {
    // }
    // render() {
    //     this.innerHTML = this.getAttribute('text') || 'Submit';
    // }
}

defineCustomElement('submit-button', SubmitButton, { extends: 'button' });

export default SubmitButton;
