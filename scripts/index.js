async function fetchName() {
  const uid = document.getElementById("uid").value;
  const nicknameEl = document.getElementById("nickname");
  nicknameEl.textContent = "Loading...";

  try {
    const res = await fetch(`/api/mihomo?uid=${uid}`);
    const data = await res.json();

    if (data.error || !data.player) {
      nicknameEl.textContent = "Error fetching data";
      return;
    }

    nicknameEl.textContent = data.player.nickname;
  } catch (error) {
    nicknameEl.textContent = "Error fetching data";
  }
}
