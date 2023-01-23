import eyeBlueIcon from "../assets/svg/eye_blue.js";
import downloadBlueIcon from "../assets/svg/download_blue.js";

export default (bill) => {
  return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye"data-bill-url=${bill.fileUrl}>
      <span id="file-name">${bill.fileName}</span>
      ${eyeBlueIcon}
      </div>
      </div>`;
};
