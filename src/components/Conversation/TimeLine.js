import React from "react";


const addNewMessageTimeLine = ({ lastTime, data, messges, time }) => {
    const lastTimeStamp = convertToTimestamp(lastTime);
    const timeStamp = convertHSOToTimestamp(time);
    const condition = timeStamp - lastTimeStamp;
    console.log(condition);
}

const addSingleTimeLine = (messages) => {
    // Sao chép mảng để tránh thay đổi mảng gốc
    const result = [...messages];

    // Định dạng thời gian của message cuối cùng
    const lastMessage = messages[messages.length - 1];
    const timeFormatted = new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Chèn phần tử trước phần tử cuối cùng
    result.splice(result.length - 1, 0, { type: "divider", text: "timeFormatted" });

    return result;
};


const messagesWithTimeLine = addTimeLine(current_messages);
console.log('timelineeeee', messagesWithTimeLine);

const convertToTimestamp = (timeArray) => {
    // Check if timeArray is an array and has at least one element
    if (!Array.isArray(timeArray) || timeArray.length === 0) {
        console.error("Invalid time array:", timeArray);
        return 0;  // Return 0 or handle the error as needed
    }

    // Access the string from the array
    const timeString = timeArray[0];

    // Ensure timeString is a valid string
    if (typeof timeString !== 'string' || !timeString.includes(":")) {
        console.error("Invalid time string:", timeString);
        return 0;  // Return 0 or handle the error as needed
    }

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set today's date with the given time
    return date.getTime();
};
const convertHSOToTimestamp = (createdAt) => {
    // Kiểm tra nếu createdAt là chuỗi và có thể chuyển đổi
    if (typeof createdAt !== 'string' || isNaN(Date.parse(createdAt))) {
        console.error("Invalid date string:", createdAt);
        return 0; // Trả về 0 hoặc xử lý lỗi
    }

    // Khởi tạo đối tượng Date từ chuỗi ISO
    const date = new Date(createdAt);
    return date.getTime();
};


export default addNewMessageTimeLine;