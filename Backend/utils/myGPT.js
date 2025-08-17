import "dotenv/config";
import fetch from "node-fetch"; // only needed if Node < 18

const getgoogleAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    })
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      options
    );

    const data = await response.json();
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("Gemini API returned error:", data.error);
      return `Error: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini";
  } catch (err) {
    console.error("Gemini API fetch error:", err);
    return "Error calling Gemini API";
  }
};

export default getgoogleAPIResponse;


// import "dotenv/config";

// const getgoogleAPIResponse = async (message) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: message }]
//         }
//       ]
//     })
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       options
//     );

//     const data = await response.json();
//     console.log("Gemini API raw response:", data);

//     // adjust depending on API response structure
//     return data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
//   } catch (err) {
//     console.error("Gemini API error:", err);
//     return "Error calling Gemini API";
//   }
// };

// export default getgoogleAPIResponse;


// import "dotenv/config";

// const getgoogleAPIResponse = async (message) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: message }]
//         }
//       ]
//     })
//   };

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//       options
//     );
//     const data = await response.json();
//     console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

//     // Safely extract the reply
//     return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//   } catch (err) {
//     console.error("Gemini API error:", err);
//     return "";
//   }
// };

// export default getgoogleAPIResponse;


// import "dotenv/config";

// const getgoogleAPIResponse= async(message)=>{
//   const options={
//     method:"POST",
//     headers:{
//         "Content-Type":"application/json",
//         "Authorization":`X-goog-api-key ${process.env.GEMINI_API_KEY}`
//     },
//     body:JSON.stringify({
//         model:"gemini-2.5-flash",
//         messages:[{
//             role:"user",
//             content:message
//         }]
//     })
//   };
  
//   try {
//     const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",options);
//     const data=await response.json();
//     return data.choices[0].message.content;
//   } catch (err) {
//     console.log(err);
//   }
// }

// export default getgoogleAPIResponse;