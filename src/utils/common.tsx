export function getMaritalStatus(status: string) {
  switch (status) {
    case "Single":
      return "6";
    case "Married":
      return "1";

    case "Living Common-law":
      return "2";

    case "Widow(er)":
      return "3";

    case "Divorced":
      return "4";

    case "Seperated":
      return "5";

    default:
      return "";
  }
}

export function getMaritalStatusValue(status: string) {
  switch (status) {
    case "6":
      return "Single";
    case "1":
      return "Married";

    case "2":
      return "Living Common-law";

    case "3":
      return "Widow(er)";

    case "4":
      return "Divorced";

    case "5":
      return "Seperated";

    default:
      return "";
  }
}

export function getAnswersOfQuestions(status: string) {
  switch (status) {
    case "Yes":
      return "Y";
    case "No":
      return "N";
    default:
      return "N";
  }
}

export function getRealYNValue(status: string) {
  switch (status) {
    case "Y":
      return "Yes";
    case "N":
      return "No";
    default:
      return "No";
  }
}

export function getTaxPayerPreviousMaritalStatus(status: string) {
  switch (status) {
    case "Married, Living common-law":
      return "1";
    case "Single, seperated, divorced, or widow(er)":
      return "2";

    default:
      return "2";
  }
}

export function getTaxPayerPreviousMaritalStatusValue(status: string) {
  switch (status) {
    case "1":
      return "Married, Living common-law";
    case "2":
      return "Single, seperated, divorced, or widow(er)";

    default:
      return "Single, seperated, divorced, or widow(er)";
  }
}

export function getUrlParams(url: string) {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params: any = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
}
