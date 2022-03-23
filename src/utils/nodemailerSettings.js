import nodemailer from "nodemailer";

export const cartTicketMailOptions = (photo,mail,html) => ({
  from: 'jorgecoronabackend@gmail.com', // sender address
  to: ['jorgecoronabackend@gmail.com',mail], // list of receivers
  subject: "[ALERT] Cart Ticket", // Subject line
  attachments: 
  [
    {path: photo}
  ],
  html: html // html body
})

export const newUserMailOptions = (username,photo) => ({
  from: 'jorgecoronabackend@gmail.com', // sender address
  to: ['jorgecoronabackend@gmail.com'], // list of receivers
  subject: "[ALERT] New User created", // Subject line
  // text: "Hello world?", // plain text body,
  attachments: 
  [
    {path: photo}
  ],
  html: `<h1 style="color: blue;">Se ha creado un nuevo usuario.</h1><p>UserName: ${username}</p>` // html body
})

export const transporter = nodemailer.createTransport( {
  service: 'gmail',
  port: 587,
  auth: {
    user: 'jorgecoronabackend@gmail.com',
    pass: 'jorgecorona55'
  }
} )  

