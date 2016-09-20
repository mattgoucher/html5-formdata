import root from 'window-or-global';

/**
 * Emulate FormData for environments without support
 * @type {function}
 */
root.FormData = (root.FormData || class FormData {

  /**
   * Creates a new FormData object.
   * @type {object}
   */
  constructor() {
    this.fake = true;
    this._fields = [];
    this.boundary = `--------FormData${Math.random()}`;
  }

  /**
   * @param {string} key The name of the field whose data is contained in value.
   * @param {object} value The field's value.
   * @returns {undefined}
   */
  append(key, value) {
    this._fields.push([key, value]);
  }

  /**
   * Serialize form data object
   * @returns {string}
   */
  toString() {
    return this._fields.reduce((body, field) => {
      body += `--${this.boundary}\r\n`;

      // File has a name attribute
      if (field[1].name) {
        body += `Content-Disposition: form-data; name="${field[0]}"; filename="${field[1].name}"\r\n`;
        body += `Content-Type: "${field[1].type}"\r\n\r\n`;
        body += `${field[1].getAsBinary()}\r\n`;
        return body;
      }

      // Utilize key from append
      body += `Content-Disposition: form-data; name="${field[0]}";\r\n\r\n`;
      body += `${field[1]}\r\n`;

      return body;
    }, '');
  }
});
