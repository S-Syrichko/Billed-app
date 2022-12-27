import eyeBlueIcon from "../assets/svg/eye_blue.js";
import downloadBlueIcon from "../assets/svg/download_blue.js";

export default (bill) => {
  if (bill.fileName == "null") {
    return `<div class="icon-actions">
    <span id="no-file">Aucun fichier trouvé</span>
    </div>`;
  } else {
    return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye"data-bill-url=${bill.fileUrl}>
      <span id="file-name">${bill.fileName}</span>
      ${eyeBlueIcon}
      </div>
      </div>`;
  }
};
