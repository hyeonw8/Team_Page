// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDk1C8F0t_ubSIX2jB3l2ijm6vALHTYSP0",
    authDomain: "sparta-26a3f.firebaseapp.com",
    projectId: "sparta-26a3f",
    storageBucket: "sparta-26a3f.appspot.com",
    messagingSenderId: "921839954023",
    appId: "1:921839954023:web:c10addde3cf01b18b88cc2",
    measurementId: "G-PENKWVQ51X"
};


// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 방명록 폼 제출 이벤트 핸들러
document.getElementById("guestbook-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // 폼 제출 방지

    // 입력된 값 가져오기
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const password = document.getElementById("password").value;

    try {
        // Firestore에 데이터 추가
        await addDoc(collection(db, "guestbook"), {
            name: name,
            message: message,
            password: password,
            timestamp: Number(new Date()) // 등록 순으로 정렬하기 위해
        });
        window.alert("등록 성공");
        // 페이지 새로고침
        window.location.reload();
    } catch (error) {
        // 오류 메시지 표시
        console.error("Error adding document: ", error);
        window.alert("방명록을 제출하는 동안 오류가 발생했습니다.");
    }
});

// Firebase에서 방명록 항목 가져오기
async function fetchGuestbookEntries() {
    const querySnapshot = await getDocs(
        query(collection(db, "guestbook"), orderBy("timestamp", "desc"))
    );
    // querySnapshot.forEach((doc) => {
    //     const entry = doc.data();
    //     displayGuestbookEntry(doc.id, entry); // 문서 ID도 전달
    // });
    for (const doc of querySnapshot.docs) { // 비동기 배열 순회 
        const entry = doc.data();
        displayGuestbookEntry(doc.id, entry);
    }
}

// 방명록 항목을 화면에 표시
function displayGuestbookEntry(docId, entry) {
    const guestbookEntriesDiv = document.getElementById("guestbook-entries");
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("guestbook-entry");
    entryDiv.innerHTML = `
                <p><strong>${entry.name}</strong>: ${entry.message}</p>
                <button class="edit-btn" data-doc-id="${docId}">수정</button>
                <button class="delete-btn" data-doc-id="${docId}">삭제</button>
            `;
    guestbookEntriesDiv.appendChild(entryDiv);
}

// 삭제 버튼 클릭 이벤트 처리
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const promptPassword = window.prompt("삭제하시려면 비밀번호를 입력하세요.",);
        const docId = event.target.getAttribute("data-doc-id");
        const userInfo = await getDoc(doc(db, "guestbook", docId));
        const userPassword = userInfo.data().password;

        if (promptPassword == userPassword) {

            console.log("Deleting document with ID:", docId); // docId 출력                    
            try {
                // Firestore에서 문서 삭제
                await deleteDoc(doc(db, "guestbook", docId));
                // 삭제한 항목 제거
                event.target.parentElement.remove();
                console.log("Document deleted successfully."); //삭제 성공 메시지 출력
            } catch (error) {
                console.error("Error deleting document: ", error);
                window.alert("방명록 항목을 삭제하는 동안 오류가 발생했습니다.");
            }
        } else {
            window.alert("잘못 입력하셨습니다.");
        }
    }
});

// 수정 버튼 클릭 이벤트 처리
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("edit-btn")) {
        const docId = event.target.getAttribute("data-doc-id");
        const parentDiv = event.target.parentElement; // 수정 버튼의 부모 요소인 div 가져오기
        const messageSpan = parentDiv.querySelector("p"); // 해당하는 부모요소에서 메시지 <p> 요소

        const name = messageSpan.textContent.split(": ")[0];
        const promptPassword = window.prompt("비밀번호를 입력하세요.",);
        const userInfo = await getDoc(doc(db, "guestbook", docId));
        const userPassword = userInfo.data().password;

        if (promptPassword == userPassword) {
            const newMessage = window.prompt("메시지를 입력하세요:",);

            if (newMessage !== null) {
                try {
                    // Firestore에서 문서 업데이트
                    await updateDoc(doc(db, "guestbook", docId), {
                        message: newMessage
                    });
                    messageSpan.textContent = `${name}: ${newMessage}`;
                    window.alert("메시지가 업데이트되었습니다.");

                } catch (error) {
                    console.error("Error updating document: ", error);
                    window.alert("메시지를 업데이트하는 동안 오류가 발생했습니다.");
                }
            }
        } else {
            window.alert("비밀번호를 잘못 입력하셨습니다.");
        }

    }
});

// 페이지 로드시 방명록 항목 가져오기
fetchGuestbookEntries();