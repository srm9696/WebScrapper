const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 600 });
  await page.goto("https://lg4all.com/secondsale/");
  await page.setDefaultTimeout(2 * 60 * 1000); //For 5 min: 5 * 60 * 1000

  //Get the current time
  // const time = new Date().getTime();
  // const time = new Date().toTimeString();
  // console.log(time.getHours());
  // const time2 = new Date();
  // console.log(time);
  // console.log(time2);

  // const loginTime = new Date(2022, 6, 13, 7, 14, 0).getTime();
  // const loginTime2 = new Date(2022, 6, 13, 7, 14, 0);//
  // console.log(loginTime);
  // console.log(loginTime2);

  // console.log(Math.abs(time - loginTime));

  //Login page details
  const doLogin = async () => {
    console.log("Site opened! Filling login details.");
    await page.select("#ContentPlaceHolder1_loginUser_ddlSystem", "3");
    await page.type("#ContentPlaceHolder1_loginUser_UserName", "Y00113");
    await page.type("#ContentPlaceHolder1_loginUser_Password", "lgeil@2022");
  };
  await doLogin();

  await Promise.all([
    page.click("#ContentPlaceHolder1_loginUser_LoginImageButton"),

    // page.waitFor(2000), //To handle alert
    // page.on("dialog", async (dialog) => {
    //   console.log(dialog.accept());
    // }),
    page.waitForNavigation(),
  ]);
  // await page.waitFor(5000);

  // if (time === "12:55:00 am") {
  //   console.log("Can login");
  //   await Promise.all([
  //     page.click("#ContentPlaceHolder1_loginUser_LoginImageButton"),
  //     page.waitForNavigation(),
  //   ]);
  // }

  console.log("Logged in");

  const selectProduct = async () => {
    await page.select("#ContentPlaceHolder1_ddlProduct", "REF"); //"FPD" category
    // // await page.waitForSelector("#ContentPlaceHolder1_gridsdata_chkSelect_0");
    // await page.select("#ContentPlaceHolder1_ddlBranch", "CMP"); //Select branch
    // // await page.select("#ContentPlaceHolder1_ddlModelCode", "25UM58-P.ATR");//Select model code
    console.log("Selected product and loaded");

    await page.waitForSelector("#ContentPlaceHolder1_gridsdata_chkSelect_0");

    const data = await page.evaluate(() => {
      // console.log("Evaluating");
      // mybody = document.getElementsByTagName("body")[0];
      // mytable = document.getElementById("ContentPlaceHolder1_gridsdata");
      // mytablebody = mytable.getElementsByTagName("tbody")[0];
      // myrow = Array.from(mytablebody.getElementsByTagName("tr"));
      // mydata = Array.from(
      //   myrow.map((el) => el.getElementsByTagName("td").innerHTML)
      // );
      // // mydata = myrow.getElementsByTagName("td");
      // // return mytable;
      // return myrow;

      // document
      //   .querySelector(".GridViewRowStyle")
      //   .nextElementSibling.setAttribute("class", "GridViewRowStyle");

      const trs = Array.from(document.querySelectorAll(".GridViewRowStyle"));
      trs.map((ele) =>
        ele.nextElementSibling?.setAttribute("class", "GridViewRowStyle")
      );
      const trsAll = Array.from(document.querySelectorAll(".GridViewRowStyle"));

      // trs.map((tr) => {
      //   tr.classList.add("MyClass");
      // });
      // const trsAlt = Array.from(
      //   document.querySelectorAll(".GridViewAlternatingRowStyle")
      // ); //Not selecting the exact record due to the array formed by the alternating classes (GridViewRowStyle & GridViewAlternatingRowStyle)
      // const trsAll = [...trs, ...trsAlt];
      // const trsAll =

      return trsAll
        .map((tr) => tr.innerHTML)
        .reduce(
          (val, el, i) =>
            el.includes("GC-C247UGBM.BBMQEBN") || el.includes("80") ? i : val,
          -1
        );

      // return trs.map((td) => td.innerText);
      // return test.map((td) => td.innerHTML);
      // return [1, 2, 3];
    });
    // data.forEach((element) => {
    //   const eachEle = element.innerHTML;
    //   console.log(eachEle);
    // });
    // console.log(data);
    // console.log(data.innerHTML);

    // console.log(data.map((node) => node.item));
    // console.log(data.length);
    // console.log(data[0]);

    //Product, ModelSuffix, if available then serial number
    //18-Jun **** OLED77G1PTZ.ATRG //Brnch-COI, SerialNo-202INZY9G861
    // 202INKH9G893-AEY
    // 202INZY9G861
    // 802KCJZPW404_AQZ
    // 707KCQXQ9052_AQZ
    // console.log(data.length);
    // GridViewRowStyle;
    // GridViewAlternatingRowStyle;

    // const table = await page.waitForSelector("#ContentPlaceHolder1_gridsdata");
    // console.log(table);

    page.click(`#ContentPlaceHolder1_gridsdata_chkSelect_${data}`, {
      clickCount: 1,
    });
  };
  await selectProduct();

  await page.waitForNetworkIdle();

  //Fill Details
  const fillDetails = async () => {
    await page.type("#ContentPlaceHolder1_txtname", "ABCD");
    await page.type("#ContentPlaceHolder1_txtHouseNo", "10");
    await page.type("#ContentPlaceHolder1_txtStreetNo", "Pune");
    await page.type("#ContentPlaceHolder1_txtAppartmentNo", "5");
    await page.type("#ContentPlaceHolder1_txtPhoneNo", "9876543210");
    console.log("Filled customer details");
  };
  await fillDetails();

  //Place orders
  const placeOrder = async () => {
    await Promise.all([
      // page.click("#ContentPlaceHolder1_btnPlaceOrder"), //Place orders
      page.click("#ContentPlaceHolder1_btnView"), //View orders
      page.waitForNavigation(),
    ]);
  };
  await placeOrder();

  await browser.waitForTarget(() => false);
  await browser.close();
})();
