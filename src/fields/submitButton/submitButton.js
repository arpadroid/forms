class SubmitButton extends window.arpadroid.ui.Button {
    // static get observedAttributes() {
    //     return ['text'];
    // }
    // connectedCallback() {
    // }
    // render() {
    //     this.innerHTML = this.getAttribute('text') || 'Submit';
    // }
}

customElements.define('submit-button', SubmitButton, { extends: 'button' });

export default SubmitButton;
