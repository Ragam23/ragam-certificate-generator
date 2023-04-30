// const base = "/Ragam-Certificate-Generator"
// const base =""
const base = "/certificates";

const addText = (text) => {
  let h3s = document.querySelectorAll("h3");
  for (let i = 0; i < h3s.length; i++) {
    h3 = h3s[i];
    h3.parentNode.removeChild(h3);
  }
  let main = document.querySelector(".main");
  var h = document.createElement("H3");
  var t = document.createTextNode(text);
  h.appendChild(t);
  main.appendChild(h);
};

const verifyUser = async (regID) => {
  let res = await fetch("./participants.json");
  res = await res.json();
  if (res[regID]) return res[regID];
  return null;
};

const titleCase = (str) => {
  str = str.split(/[ ._]+/);
  for (var i = 0; i < str.length; i++) {
    if (str[i].length > 2) {
      str[i] =
        str[i].toLowerCase().charAt(0).toUpperCase() +
        str[i].slice(1).toLowerCase();
    }
  }
  return str.join(" ");
};

async function drawPDF(user, certificate, i, workshop, exBytes, exFont, isEvent) {
  const { PDFDocument, rgb } = PDFLib;
  let main = document.querySelector(".main");

  const pdfDoc = await PDFDocument.load(exBytes);

  pdfDoc.registerFontkit(fontkit);
  const myFont = await pdfDoc.embedFont(exFont);

  const pages = pdfDoc.getPages();
  const firstPg = pages[0];

  try {
    if (user != null) {
      if(isEvent){
        let name = user.name.trim();
        name = titleCase(name);
  
        let textSize = name.length > 24 ? 25:35;
        const textWidth = myFont.widthOfTextAtSize(name, textSize);
        const textHeight = myFont.heightAtSize(textSize);
  
  
        let opts = {
          size: textSize,
          x: firstPg.getWidth() / 2 - textWidth / 2,
          y: firstPg.getHeight() / 2 - textHeight / 2 - 15,
          color: rgb(
            certificate.name.fontColor.r,
            certificate.name.fontColor.g,
            certificate.name.fontColor.b
          ),
          font: myFont,
        };
        firstPg.drawText(name, opts);
      }else{
        let name = user.name.trim();
        name = titleCase(name);

        let opts = {
          size: certificate.name.fontSize,
          x: certificate.name.x,
          y: certificate.name.y,
          color: rgb(
            certificate.name.fontColor.r,
            certificate.name.fontColor.g,
            certificate.name.fontColor.b
          ),
          font: myFont,
        };
        firstPg.drawText(name, opts);
      }



      let college = user.college.toUpperCase().trim();
      opts = {
        x: certificate.college.x,
        y: certificate.college.y,
        color: rgb(
          certificate.college.fontColor.r,
          certificate.college.fontColor.g,
          certificate.college.fontColor.b
        ),
        font: myFont,
        size: certificate.college.fontSize,
      };

      college.length < 10 ? (opts.size = 17) : "";

      firstPg.drawText(college, opts);

      if (!isEvent) {
        opts = {
          // size: certificate.name.fontSize,
          // x: workshop.length<35?certificate.workshop.x:180,
          x: certificate.workshop.x,
          y: certificate.workshop.y,
          color: rgb(
            certificate.workshop.fontColor.r,
            certificate.workshop.fontColor.g,
            certificate.workshop.fontColor.b
          ),
          font: myFont,
          size: certificate.workshop.fontSize,
        };

        firstPg.drawText(workshop, opts);

        let date = user.dates[i];
        opts = {
          x: certificate.date.x,
          y: certificate.date.y,
          color: rgb(
            certificate.date.fontColor.r,
            certificate.date.fontColor.g,
            certificate.date.fontColor.b
          ),
          font: myFont,
          size: certificate.date.fontSize,
        };

        firstPg.drawText(date, opts);

        var qr = new QRious({
          value: window.location.href,
          foreground: certificate.qrCode.foreground,
          background: certificate.qrCode.background,
        });
        qr = qr.toDataURL();
        const qrImage = await pdfDoc.embedPng(qr);

        firstPg.drawImage(qrImage, {
          x: certificate.qrCode.x,
          y: certificate.qrCode.y,
          width: 100,
          height: 100,
        });
      }
    }
    if(isEvent){
      let event = user.events[i];
          opts = {
            x: certificate.event.x,
            y: certificate.event.y,
            color: rgb(
              certificate.event.fontColor.r,
              certificate.event.fontColor.g,
              certificate.event.fontColor.b
            ),
            font: myFont,
            size: certificate.event.fontSize,
          };
  
          firstPg.drawText(event, opts);  
    }

    const uri = await pdfDoc.saveAsBase64({ dataUri: true });
    var elem = document.createElement("button");
    elem.setAttribute("id", "download-button");
    elem.innerHTML = workshop;

    var anchor = document.createElement("a");
    anchor.href = uri;
    anchor.download = "Ragam'23 Certificate.pdf";
    anchor.appendChild(elem);
    main.appendChild(anchor);
  } catch (err) {
    console.log(err);
  }
}

const generateRagamPDF = async (user, workshop, i, isEvent) => {
  const exFont = await fetch("./fonts/Montserrat-Bold.otf").then((res) => {
    return res.arrayBuffer();
  });

  if (!isEvent) {
    const certificate = await fetch("./certificate/details.json").then((res) => {
      return res.json();
    });

    const exBytes = await fetch("./certificate/certificate.pdf").then((res) => {
      return res.arrayBuffer();
    });

    drawPDF(user, certificate, i, workshop, exBytes, exFont, 0);
  } else {
    const certificate = await fetch("./certificate/details2.json").then((res) => {
      return res.json();
    });

    const exBytes = await fetch("./certificate/certificate2.pdf").then(
      (res) => {
        return res.arrayBuffer();
      }
    );
      
    drawPDF(user, certificate, i, workshop, exBytes, exFont, 1);
  }
};

var button = document.getElementById("button");
var ID = document.getElementById("ID"); // Get only the element.
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

window.onload = async (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const regID = urlParams.get("id");
  if (regID) {
    verifyUser(regID).then((user) => {
      if (user) {
        document.getElementById("form").style.display = "none";

        let main = document.querySelector(".main");
        var confirm = document.createElement("span");
        confirm.innerHTML =
          "This is to certify that " +
          titleCase(user.name.trim()) +
          " has participated in the following workshops/events during Ragam'23. Download the certificates below.";
        main.appendChild(confirm);
        if (user.workshops){
          user.workshops.forEach((workshop, i) =>
          generateRagamPDF(user, workshop, i, 0)
          );
        }
        if (user.events){
          user.events.forEach((event, i) =>
            generateRagamPDF(user, event, i, 1)
          );
        }
      } else {
        document.getElementsByClassName("error")[0].classList.add("show");
        setTimeout(
          () =>
            document
              .getElementsByClassName("error")[0]
              .classList.remove("show"),
          2500
        );
      }
    });
  }
};

button.addEventListener(
  "click",
  function (e) {
    e.preventDefault();
    var regID = ID.value.toUpperCase();
    if (regID.length === 0) {
      alert("Enter your Ragam ID");
      return;
    }
    verifyUser(regID).then((user) => {
      if (user) {
        window.location.href =
          window.location.href.split("?")[0] + "?id=" + regID;
      } else {
        document.getElementsByClassName("error")[0].classList.add("show");
        setTimeout(
          () =>
            document
              .getElementsByClassName("error")[0]
              .classList.remove("show"),
          2500
        );
      }
    });
  },
  false
);
