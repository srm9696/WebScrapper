//BranchModelDiscount.js
//Steps to perform at real time :
//->Change product category(l-31), model suffix(l-49), serial no.(l-49), and discount(l-49)
//->Uncomment click book order button (Line 91)
//->Run command on terminal 'node BranchModelDiscount.js' before 10 mins
//->Click login button

//18Jun2022 OLED COI--> Prod: FPD, Sr.No.: 202INZY9G861, ModSuffix: OLED77G1PTZ.ATRG, Dis: 80
//15Jun: Brnch:JAM, Model:SN6Y.DINDLLK --Failed (product not found)
//16Jun: Brnch:MAD, ModSuf: 25UM58-P.ATR-->Booked1
//17Jun: Brnch:TIR, ModSuf: GC-L257SL4L.APZQEBN--Booked2
//18Jun: Brnch:LUC, ModSuf: FHM1006ADW.ABWQEIL-->Failed with alert error (used Mobile/ Not script)
//19Jun: Brnch:BHO, ModSuf: GC-B247SQUV.BMCQEBN--Booked3
//20Jun: 24"4K Monitor MUM--> Prod: MNT, Sr.No.: 203NTZN1K573, ModSuffix: 24UD58-B.ATR, Dis: 80-->Booked(Not by script)
//21Jun: brnch: AAZ, ModSuf:FHV1409ZWB.ABLQEIL-->Booked4
//24Jun: brnch: COI, ModSuf:FHD1057SWS.ASSPEIL-->Booked5
//7Jul: brnch: CMP, ModSuf: PSNQ19BNZE.AMLG -->Booked6(07 Sec)
//08Jul: brnch:WAR, ModSuf: PSNQ19BWZF.ANLG --->Not loaded(Late to inform)
//09Jul: brnch:WAR, ModSuf: PSNQ13ENYE.AMLG  --->Site Not loaded (Late to inform & Wifi not working)
//10Jul: brnch:AUR, ModSuf: PSUQ13ENZE.AMLG  --->Booked7(12 Sec)
//10Jul: brnch:MUM, ModSuf: GN-H702HLHQ.APZQEBN  --->Not Booked (Site updated-'Already logged' in popup)
//18Jul: brnch:COC, Mod.Suf: GC-B247SQUV.BMCQEBN, Acc:Y00130(Mohit)-->Booked8(Manually)

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 600 });
  await page.goto("https://lg4all.com/secondsale/");
  await page.setDefaultTimeout(15 * 60 * 1000); //For 15 min: 15 * 60 * 1000

  //Login page details
  console.log("Site opened! Filling login details.");
  await page.select("#ContentPlaceHolder1_loginUser_ddlSystem", "3");
  await page.type("#ContentPlaceHolder1_loginUser_UserName", "Y00119"); //Y00278
  await page.type("#ContentPlaceHolder1_loginUser_Password", "lgeil@2022"); //ANAND@2021
  await Promise.all([
    // page.click("#ContentPlaceHolder1_loginUser_LoginImageButton"), //click manual login
    page.waitForNavigation(),
  ]);

  console.log("Logged in");
  await page.select("#ddlProduct", "MNT"); //"MNT" category
  // await page.waitForNetworkIdle();
  // await page.select("#ContentPlaceHolder1_ddlProduct", "MNT"); //"MNT" category
  // await page.select("#ddlProduct", "CHE"); //Select branch

  console.log("Selected product and loaded");
  await page.waitForSelector("#ContentPlaceHolder1_gridsdata_chkSelect_0");

  const data = await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll(".GridViewRowStyle"));
    trs.map((ele) =>
      ele.nextElementSibling?.setAttribute("class", "GridViewRowStyle")
    );
    const trsAll = Array.from(document.querySelectorAll(".GridViewRowStyle"));

    //For 15Jun: 24" Monitor, MNT
    return trsAll
      .map((tr) => tr.innerHTML)
      .reduce(
        (val, el, i) =>
          el.includes("34WN780-B.ATR") //|| el.includes("80") //||
            ? // el.includes("203INGQ6L695") &&
              // (el.includes("80") || el.includes("60"))
              i
            : val,
        -1
      );
    //For 18Jun : OLED FPD
    // return trsAll
    //   .map((tr) => tr.innerHTML)
    //   .reduce(
    //     (val, el, i) =>
    //       el.includes("OLED77G1PTZ.ATRG") ||
    //       (el.includes("202INZY9G861") &&
    //         (el.includes("80") || el.includes("60")))
    //         ? i
    //         : val,
    //     -1
    //   );
  });

  page.click(`#ContentPlaceHolder1_gridsdata_chkSelect_${data}`, {
    clickCount: 1,
  });
  await page.waitForNetworkIdle();

  //Fill Details--Need to modify
  await page.type("#ContentPlaceHolder1_txtname", "Salman");
  await page.type("#ContentPlaceHolder1_txtHouseNo", "Wagholi, Pune");
  await page.type("#ContentPlaceHolder1_txtStreetNo", "Wagholi, Pune");
  await page.type("#ContentPlaceHolder1_txtAppartmentNo", "Wagholi, Pune");
  await page.type("#ContentPlaceHolder1_txtPhoneNo", "1111111111");
  await page.select("#ddlPayType", "2");
  await page.select("#ddlPaymentMode", "4");

  console.log("Filled customer details");

  //Place orders
  await Promise.all([
    // page.click("#ContentPlaceHolder1_btnPlaceOrder"), //Place orders
    // page.click("#ContentPlaceHolder1_btnView"), //View orders for testing
    page.waitForNavigation(),
  ]);

  await browser.waitForTarget(() => false);
  await browser.close();
})();
