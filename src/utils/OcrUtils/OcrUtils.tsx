export function T4GetNames(number: string) {
  switch (number) {
    case "10":
      return "Province of Employment";
    case "12":
      return "Social Insurance Number";
    case "14":
      return "Total Earnings";
    case "16":
      return "Employee's CPP Contributions";
    case "17":
      return "Employee's QPP Contributions";
    case "18":
      return "Employee's EI Premiums";
    case "20":
      return "RPP Contributions";
    case "22":
      return "Income Tax Deducted";
    case "24":
      return "EI Insurable Earnings";
    case "26":
      return "CPP/QPP Pensionable Earnings";
    case "28":
      return "Exempt CPP/QPP/EI/PPIP";
    case "29":
      return "Employment Code";
    case "44":
      return "Union Dues";
    case "46":
      return "Charitable Donations";
    case "50":
      return "RPP or DPSP Registration Number";
    case "52":
      return "Pension Adjustment";
    case "54":
      return "Employer's Account Number";
    case "55":
      return "Employee's PPIP Premiums";
    case "56":
      return "PPIP Insurable Earnings";
    case "30":
      return "Board and Lodging";
    case "31":
      return "Special Work Site";
    case "32":
      return "Travel in a Prescribed Zone";
    case "33":
      return "Medical Travel Assistance";
    case "34":
      return "Personal Use of Employer's Automobile or Motor Vehicle";
    case "36":
      return "Interest-Free and Low-Interest Loans";
    case "38":
      return "Security Options Benefits";
    case "39":
      return "Security Options Deduction (110.1(d))";
    case "40":
      return "Other Taxable Allowances and Benefits";
    case "41":
      return "Security Options Deduction (110.1(d.1))";
    case "42":
      return "Employment Commissions";
    case "43":
      return "Canadian Forces Personnel";
    case "57":
      return "Employment Income – March 15 to May 9";
    case "58":
      return "Employment Income – May 10 to July 4";
    case "59":
      return "Employment Income – July 5 to August 29";
    case "60":
      return "Employment Income – August 30 to September 26";
    case "66":
      return "Eligible Retiring Allowances";
    case "67":
      return "Non-Eligible Retiring Allowances";
    case "68":
      return "Indian - Eligible Retiring Allowances";
    case "69":
      return "Indian - IDN-Eligible Retiring Allowances";
    case "71":
      return "Indian (Exempt Income) - Employment";
    case "72":
      return "BOX 72";
    case "73":
      return "BOX 73";
    case "74":
      return "Pre-1990 While a Contributor";
    case "75":
      return "Pre-1990 While IDT a Contributor";
    case "77":
      return "Workers Comp. Benefits Repaid";
    case "78":
      return "Fishers - Gross Earnings";
    case "79":
      return "Fishers - Net Partnership Amount";
    case "80":
      return "Fishers - Shareperson Amount";
    case "81":
      return "Agency Workers";
    case "82":
      return "Passenger-Carrying Vehicles";
    case "83":
      return "Barbers or Hairdressers";
    case "84":
      return "Public Transit Pass";
    case "85":
      return "Private Health Services Plans";
    case "87":
      return "Emergency Serv. Volunteers Exemption";
    case "88":
      return "Indian (Exempt Income)";

    default:
      break;
  }
}

export function getT4SearchableData() {
  let getData = [];
  getData.push({
    title: "Province of Employment",
    value: "0",
    BoxNumber: "10",
    dropDownValue: "10 Province of Employment",
  });
  getData.push({
    title: "Social Insurance Number",
    value: "0",
    BoxNumber: "12",
    dropDownValue: "12 Social Insurance Number",
  });
  getData.push({
    title: "Total Earnings",
    value: "0",
    BoxNumber: "14",
    dropDownValue: "14 Total Earnings",
  });
  getData.push({
    title: "Employee's CPP Contributions",
    value: "0",
    BoxNumber: "16",
    dropDownValue: "16 Employee's CPP Contributions",
  });
  getData.push({
    title: "Employee's QPP Contributions",
    value: "0",
    BoxNumber: "17",
    dropDownValue: "17 Employee's QPP Contributions",
  });
  getData.push({
    title: "Employee's EI Premiums",
    value: "0",
    BoxNumber: "18",
    dropDownValue: "18 Employee's EI Premiums",
  });
  getData.push({
    title: "RPP Contributions",
    value: "0",
    BoxNumber: "20",
    dropDownValue: "20 RPP Contributions",
  });
  getData.push({
    title: "Income Tax Deducted",
    value: "0",
    BoxNumber: "22",
    dropDownValue: "22 Income Tax Deducted",
  });
  getData.push({
    title: "EI Insurable Earnings",
    value: "0",
    BoxNumber: "24",
    dropDownValue: "24 EI Insurable Earnings",
  });
  getData.push({
    title: "CPP/QPP Pensionable Earnings",
    value: "0",
    BoxNumber: "26",
    dropDownValue: "26 CPP/QPP Pensionable Earnings",
  });
  getData.push({
    title: "Exempt CPP/QPP/EI/PPIP",
    value: "0",
    BoxNumber: "28",
    dropDownValue: "28 Exempt CPP/QPP/EI/PPIP",
  });
  getData.push({
    title: "Employment Code",
    value: "0",
    BoxNumber: "29",
    dropDownValue: "29 Employment Code",
  });
  getData.push({
    title: "Union Dues",
    value: "0",
    BoxNumber: "44",
    dropDownValue: "44 Union Dues",
  });
  getData.push({
    title: "Charitable Donations",
    value: "0",
    BoxNumber: "46",
    dropDownValue: "46 Charitable Donations",
  });
  getData.push({
    title: "RPP or DPSP Registration Number",
    value: "0",
    BoxNumber: "50",
    dropDownValue: "50 RPP or DPSP Registration Number",
  });
  getData.push({
    title: "Pension Adjustment",
    value: "0",
    BoxNumber: "52",
    dropDownValue: "52 Pension Adjustment",
  });
  getData.push({
    title: "Employer's Account Number",
    value: "0",
    BoxNumber: "54",
    dropDownValue: "54 Employer's Account Number",
  });
  getData.push({
    title: "Employee's PPIP Premiums",
    value: "0",
    BoxNumber: "55",
    dropDownValue: "55 Employee's PPIP Premiums",
  });
  getData.push({
    title: "PPIP Insurable Earnings",
    value: "0",
    BoxNumber: "56",
    dropDownValue: "56 PPIP Insurable Earnings",
  });
  getData.push({
    title: "Board and Lodging",
    value: "0",
    BoxNumber: "30",
    dropDownValue: "30 Board and Lodging",
  });
  getData.push({
    title: "Special Work Site",
    value: "0",
    BoxNumber: "31",
    dropDownValue: "31 Special Work Site",
  });
  getData.push({
    title: "Travel in a Prescribed Zone",
    value: "0",
    BoxNumber: "32",
    dropDownValue: "32 Travel in a Prescribed Zone",
  });
  getData.push({
    title: "Medical Travel Assistance",
    value: "0",
    BoxNumber: "33",
    dropDownValue: "33 Medical Travel Assistance",
  });
  getData.push({
    title: "Personal Use of Employer's Automobile or Motor Vehicle",
    value: "0",
    BoxNumber: "34",
    dropDownValue: "34 Personal Use of Employer's Automobile or Motor Vehicle",
  });
  getData.push({
    title: "Interest-Free and Low-Interest Loans",
    value: "0",
    BoxNumber: "36",
    dropDownValue: "36 Interest-Free and Low-Interest Loans",
  });
  getData.push({
    title: "Security Options Benefits",
    value: "0",
    BoxNumber: "38",
    dropDownValue: "38 Security Options Benefits",
  });
  getData.push({
    title: "Security Options Deduction (110.1(d))",
    value: "0",
    BoxNumber: "39",
    dropDownValue: "39 Security Options Deduction (110.1(d))",
  });
  getData.push({
    title: "Other Taxable Allowances and Benefits",
    value: "0",
    BoxNumber: "40",
    dropDownValue: "40 Other Taxable Allowances and Benefits",
  });
  getData.push({
    title: "Security Options Deduction (110.1(d))",
    value: "0",
    BoxNumber: "41",
    dropDownValue: "41 Security Options Deduction (110.1(d.1))",
  });
  getData.push({
    title: "Employment Commissions",
    value: "0",
    BoxNumber: "42",
    dropDownValue: "42 Employment Commissions",
  });

  getData.push({
    title: "Canadian Forces Personnel",
    value: "0",
    BoxNumber: "43",
    dropDownValue: "43 Canadian Forces Personnel",
  });
  getData.push({
    title: "Employment Income – March 15 to May 9",
    value: "0",
    BoxNumber: "57",
    dropDownValue: "57 Employment Income – March 15 to May 9",
  });
  getData.push({
    title: "Employment Income – May 10 to July 4",
    value: "0",
    BoxNumber: "58",
    dropDownValue: "58 Employment Income – May 10 to July 4",
  });
  getData.push({
    title: "Employment Income – July 5 to August 29",
    value: "0",
    BoxNumber: "59",
    dropDownValue: "59 Employment Income – July 5 to August 29",
  });
  getData.push({
    title: "Employment Income – August 30 to September 26",
    value: "0",
    BoxNumber: "60",
    dropDownValue: "60 Employment Income – August 30 to September 26",
  });
  getData.push({
    title: "Eligible Retiring Allowances",
    value: "0",
    BoxNumber: "66",
    dropDownValue: "66 Eligible Retiring Allowances",
  });
  getData.push({
    title: "Non-Eligible Retiring Allowances",
    value: "0",
    BoxNumber: "67",
    dropDownValue: "67 Non-Eligible Retiring Allowances",
  });
  getData.push({
    title: "Indian - Eligible Retiring Allowances",
    value: "0",
    BoxNumber: "68",
    dropDownValue: "68 Indian - Eligible Retiring Allowances",
  });
  getData.push({
    title: "Indian - IDN-Eligible Retiring Allowances",
    value: "0",
    BoxNumber: "69",
    dropDownValue: "69 Indian - IDN-Eligible Retiring Allowances",
  });
  getData.push({
    title: "Indian (Exempt Income) - Employment",
    value: "0",
    BoxNumber: "71",
    dropDownValue: "71 Indian (Exempt Income) - Employment",
  });
  getData.push({
    title: "BOX 72",
    value: "0",
    BoxNumber: "72",
    dropDownValue: "72 BOX 72",
  });
  getData.push({
    title: "BOX 73",
    value: "0",
    BoxNumber: "73",
    dropDownValue: "73 BOX 73",
  });

  getData.push({
    title: "Pre-1990 While a Contributor",
    value: "0",
    BoxNumber: "74",
    dropDownValue: "74 Pre-1990 While a Contributor",
  });
  getData.push({
    title: "Pre-1990 While IDT a Contributor",
    value: "0",
    BoxNumber: "75",
    dropDownValue: "75 Pre-1990 While IDT a Contributor",
  });
  getData.push({
    title: "Workers Comp. Benefits Repaid",
    value: "0",
    BoxNumber: "77",
    dropDownValue: "77 Workers Comp. Benefits Repaid",
  });

  getData.push({
    title: "Fishers - Gross Earnings",
    value: "0",
    BoxNumber: "78",
    dropDownValue: "78 Fishers - Gross Earnings",
  });
  getData.push({
    title: "Fishers - Net Partnership Amount",
    value: "0",
    BoxNumber: "79",
    dropDownValue: "79 Fishers - Net Partnership Amount",
  });
  getData.push({
    title: "Fishers - Shareperson Amount",
    value: "0",
    BoxNumber: "80",
    dropDownValue: "80 Fishers - Shareperson Amount",
  });

  getData.push({
    title: "Agency Workers",
    value: "0",
    BoxNumber: "81",
    dropDownValue: "81 Agency Workers",
  });
  getData.push({
    title: "Passenger-Carrying Vehicles",
    value: "0",
    BoxNumber: "82",
    dropDownValue: "82 Passenger-Carrying Vehicles",
  });
  getData.push({
    title: "Barbers or Hairdressers",
    value: "0",
    BoxNumber: "83",
    dropDownValue: "83 Barbers or Hairdressers",
  });

  getData.push({
    title: "Public Transit Pass",
    value: "0",
    BoxNumber: "84",
    dropDownValue: "84 Public Transit Pass",
  });
  getData.push({
    title: "Private Health Services Plans",
    value: "0",
    BoxNumber: "85",
    dropDownValue: "85 Private Health Services Plans",
  });
  getData.push({
    title: "Emergency Serv. Volunteers Exemption",
    value: "0",
    BoxNumber: "87",
    dropDownValue: "87 Emergency Serv. Volunteers Exemption",
  });
  getData.push({
    title: "Indian (Exempt Income)",
    value: "0",
    BoxNumber: "88",
    dropDownValue: "88 Indian (Exempt Income)",
  });

  return getData;
}

export function getSlipsUrls(type: string) {
  switch (type) {
    case "GetT4SlipInfo":
      return "/GetT4SlipInfo";
    case "GetT5SlipInfo":
      return "/GetT5SlipInfo";
    case "getT4AOASSlipInfo":
      return "/getT4AOASSlipInfo";
    case "getT5007SlipInfo":
      return "/getT5007SlipInfo";
    case "GetT4ASlipInfo":
      return "/GetT4ASlipInfo";
    case "GetT4APSlipInfo":
      return "/GetT4APSlipInfo";
    case "SaveT4SlipInfoList":
      return "/SaveT4SlipInfoList";
    case "SaveT5SlipInfoList":
      return "/SaveT5SlipInfoList";
    case "SaveT4AOASSlipInfo":
      return "/SaveT4AOASSlipInfo";
    case "SaveT4ASlipInfo":
      return "/SaveT4ASlipInfo";
    case "SaveT4APSlipInfoList":
      return "/SaveT4APSlipInfoList";
    case "SaveT5007SlipInfoList":
      return "/SaveT5007SlipInfoList";
    default:
      return "";
  }
}

export function getSlipsDeleteUrls(item: string) {
  switch (item) {
    // case Object.keys(item).some((key) => key.startsWith("T4")):
    //   return "/GetT4APSlipInfo";
    // case Object.keys(item).some((key) => key.startsWith("T5007")):
    //   return "/DeleteT4APSlipInfo";
    case "1":
      return "/DeleteT4SlipInfo";
    case "5":
      return "/DeleteT4APSlipInfo";
      case "4":
      return "/DeleteT4AOASlipInfo";
    case "11":
      return "/DeleteT5007SlipInfo";
    case "10":
      return "/DeleteT5SlipInfo";
    default:
      return "";
  }
}

export function getSlipNo(item: any, key: string) {
  switch (key) {
    case "5":
      return item["T4AP_no"];
    case "1":
      return item["T4_no"];
    case "11":
      return item["T5007_no"];
    case "10":
      return item["T5_no"];
      case "4":
        return "1";
    default:
      return "";
  }
}

export function getSlips(key: string) {
  switch (key) {
    case "1":
      return "T4 - Employment Income";
    case "2":
      return "T3 - Trust Allocations";
    case "3":
      return "T4A - Pension, CERB, CRB, CESB and Other Income";
    case "4":
      return "T4A OAS - Old Age Security";
    case "5":
      return "T4A P - Canada Pension Plan Benefits (CPP)";
    case "6":
      return "T4E - Employment Insurance Benefits";
    case "7":
      return "T4RSP - RRSP Income";
    case "8":
      return "T4RIF - RIF Income";
    case "9":
      return "T4A-RCA Statement of Distributions";
    case "10":
      return "T5 - Investment Income";
    case "11":
      return "T5007 - Statement of Benefits";
    case "12":
      return "T5008 - Statement of Securities Transactions";
    case "13":
      return "T4PS - Employee Profit Sharing";
    default:
      return "";
  }
}

export function getName(item: any) {
  switch (item.Type) {
    case "1":
      return "T4 " + (item.EmployersName ? item.EmployersName : ""); 
      case "4":
      return "T4A(OAS)";
      case "5":
      return "T4AP " + (item.Description ? item.Description : "");
      case "11":
      return "T5007";
      case "10":
      return "T5 " + (item.Description ? item.Description : "");
    // case Object.keys(item).some((key) => key.startsWith("T3")):
    //   return "T3 " + (item.TrustsName ? item.TrustsName : "");
    // case Object.keys(item).some((key) => key.startsWith("T4E")):
    //   return "T4E - Employment Insurance Benefits";
    
    // case Object.keys(item).some((key) => key.startsWith("T4A")):
    //   return "T4A " + (item.TaxPayersName ? item.TaxPayersName : "");
   
    // case Object.keys(item).some((key) => key.startsWith("T4RSP")):
    //   return "T4RSP - RRSP Income";
    // case Object.keys(item).some((key) => key.startsWith("T4RIF")):
    //   return "T4RIF - RIF Income";
    // case Object.keys(item).some((key) => key.startsWith("T4ARCA")):
    //   return "T4A-RCA Statement of Distributions";
    
    // case Object.keys(item).some((key) => key.startsWith("T5008")):
    //   return "T5008 - Statement of Securities Transactions";
    // case Object.keys(item).some((key) => key.startsWith("T4PS")):
    //   return "T4PS - Employee Profit Sharing";
    
    
    default:
      return "";
  }
}

export function navigateToScreen(item: string) {
  switch (item) {
    case "1":
      return "T4OcrScreen";
    case "11":
      return "T5007OcrScreen";
    case "5":
      return "T4APOcrScreen";
    case "10":
      return "T5OcrScreen";
      case "4":
        return "T4OASScreen";
    default:
      return null;
  }
}

export function navigateToScreenFromScanning(key: string) {
  switch (key) {
    case "T4":
      return "T4OcrScreen";
    case "T5007":
      return "T5007OcrScreen";
    case "T4A(P)":
      return "T4APOcrScreen";
      case "T4A(OAS)":
      return "T4OASScreen";
    case "T5":
      return "T5OcrScreen";
    default:
      return null;
  }
}
