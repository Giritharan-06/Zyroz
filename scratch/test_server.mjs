async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/settings');
    console.log("Settings Response Type:", res.headers.get('content-type'));
    const text = await res.text();
    console.log("Raw Response:", text.substring(0, 100));
    const data = JSON.parse(text);
    console.log("Settings Data Keys:", Object.keys(data.settings));
  } catch (err) {
    console.error("Settings fetch failed:", err.message);
  }
}

test();
