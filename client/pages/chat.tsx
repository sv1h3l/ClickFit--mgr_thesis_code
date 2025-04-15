import { getConnectedUserReq } from "@/api/get/getConnectedUserReq";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const cookie = require("cookie");

interface Props {
	userId: number;
	connectedUser: any; // Typ si uprav podle potřeby
}

interface Message {
	messageId?: number;
	chatId: number;
	userId: number;
	message: string;
	createdAt?: string;
}

const Chat = (props: Props) => {
	const router = useRouter();
	const connectionId = Number(router.query.connectionId);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:5000");
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("WebSocket otevřen");
			ws.send(JSON.stringify({ type: "joinChat", chatId: connectionId }));
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "receiveMessage") {
					setMessages((prev) => [...prev, data.message]);
				}
			} catch (e) {
				console.error("Chyba při zpracování zprávy:", e);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket zavřen");
		};

		ws.onerror = (err) => {
			console.error("Chyba WebSocket:", err);
		};

		return () => {
			ws.close();
		};
	}, [connectionId]);

	const handleSend = () => {
		if (newMessage.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({
					type: "sendMessage",
					message: {
						chatId: connectionId,
						userId: props.userId,
						message: newMessage,
					},
				})
			);
			setNewMessage("");
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded shadow">
			<div className="h-64 overflow-y-auto border-b mb-2">
				{messages.map((msg, index) => (
					<div
						key={index}
						className="mb-1">
						<b>{msg.userId === props.userId ? "Ty" : "Ostatní"}:</b> {msg.message}
					</div>
				))}
			</div>
			<div className="flex">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className="flex-1 border px-2 py-1 mr-2"
					placeholder="Napiš zprávu..."
				/>
				<button
					onClick={handleSend}
					className="bg-blue-500 text-white px-4 py-1 rounded">
					Odeslat
				</button>
			</div>
		</div>
	);
};

export default Chat;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const connectionId = Number(context.query.connectionId);

		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		console.log(connectionId);

		const resConnectedUser = await getConnectedUserReq({ authToken, connectionId });

		if (resConnectedUser.status === 200) {
			return { props: { connectedUser: resConnectedUser.data?.connectedUser, userId: resConnectedUser.data?.userId } };
		} else {
			return { props: { connectedUser: null, userId: -1 } };
		}
	} catch (error) {
		return { props: { connectedUser: null, userId: -1 } };
	}
};
