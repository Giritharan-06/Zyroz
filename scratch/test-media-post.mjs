// No import needed for native fetch in Node 18+

async function testIngest() {
  const url = "https://www.image2url.com/r2/default/images/1776663344485-sample.jpg";
  const payload = {
    name: "test-asset.jpg",
    url: url,
    size: "Remote",
    type: "Image"
  };

  try {
    console.log("Sending POST to http://localhost:5000/api/media...");
    const res = await fetch("http://localhost:5000/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error during fetch:", err.message);
  }
}

testIngest();
