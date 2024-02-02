if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/js-test/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
} else {
  alert("serviceWorker is not in navigator");
}

document.querySelector("html").requestFullscreen()

const getPathToVideo = (name) => `/js-test/public/videos/${name}.mp4`;

const allVideos = [
  {
    path: getPathToVideo("1"),
    name: 1,
  },
  {
    path: getPathToVideo("2"),
    name: 2,
  },
  {
    path: getPathToVideo("3"),
    name: 3,
  },
  {
    path: getPathToVideo("4"),
    name: 4,
  },
  {
    path: getPathToVideo("5"),
    name: 5,
  },
  {
    path: getPathToVideo("6"),
    name: 6,
  },
  {
    path: getPathToVideo("7"),
    name: 7,
  },
  {
    path: getPathToVideo("8"),
    name: 8,
  },
  {
    path: getPathToVideo("9"),
    name: 9,
  },
  {
    path: getPathToVideo("10"),
    name: 10,
  },
];

function loadAllVideos() {
  allVideos.forEach((video) => {
    addVideoToDB(video.path, video.name);
  });
}

const videosContainer = document.querySelector("#videos_container");
let loading = document.querySelector("#loading");

const request = indexedDB.open("videos", 1);

request.onsuccess = (event) => {
	loadAllVideos()
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  const objectStore = db.createObjectStore("videos", { keyPath: "name" });

  objectStore.transaction.oncomplete = (event) => {
	loadAllVideos()
  };
};

function addVideoToDB(path, name) {
  const videoRequest = fetch(path).then((response) => response.blob());
  videoRequest.then((blob) => {
    const transaction = request.result.transaction(["videos"], "readwrite");
    const objectStore = transaction.objectStore("videos");

    // Перевірка наявності запису за ключем
    const getRequest = objectStore.get(name);

    getRequest.onsuccess = (event) => {
      const existingData = event.target.result;

      if (existingData) {
        console.log(
          `Відео з ключем ${name} вже існує. Запуск функції loadVideo...`
        );
        loadVideo({ name });
      } else {
        // Якщо запис не існує, додаємо його
        const requestAdd = objectStore.add({ name, blob });

        requestAdd.onsuccess = () => {
          console.log(`Відео з ключем ${name} успішно додано до бази даних.`);
          loadVideo({ name });
        };

        requestAdd.onerror = (event) => {
          console.error(
            `Помилка додавання відео до бази даних: ${event.target.error}`
          );
        };
      }
    };

    getRequest.onerror = (event) => {
      console.error(
        `Помилка перевірки наявності запису: ${event.target.error}`
      );
    };
  });
}

function loadVideo({ name }) {
  const transaction = request.result.transaction(["videos"], "readwrite");
  const objectStore = transaction.objectStore("videos");

  const test = objectStore.get(name);

  test.onerror = (event) => {
    console.log("error");
  };

  test.onsuccess = (event) => {
    console.log(test);
    const video = document.createElement("video");
    video.controls = true;
    video.src = window.URL.createObjectURL(test.result.blob);

    videosContainer.append(video);

    loading.style.display = "none";
  };
}
