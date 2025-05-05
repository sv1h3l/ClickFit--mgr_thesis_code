import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	blacklistEntitiesIds: number[];
}
export const changeBlacklistMod = async (props: Props): Promise<GenRes<null>> => {
	const connection = await db.promise().getConnection();

	try {
		await connection.beginTransaction();

		const table = props.entityIsExercise ? "exercises" : "categories";
		const idColumn = props.entityIsExercise ? "exercise_id" : "category_id";

		await connection.query(`UPDATE ${table} SET blacklist = ? WHERE ${idColumn} = ?`, [JSON.stringify(props.blacklistEntitiesIds), props.entityId]);

		for (const blacklistedId of props.blacklistEntitiesIds) {
			const [rows] = await connection.query<any[]>(`SELECT blacklist, loose_connection, tight_connection FROM ${table} WHERE ${idColumn} = ?`, [blacklistedId]);

			if (!rows.length) continue;

			let currentBlacklist: number[] = [];

			try {
				const raw = rows[0].blacklist;

				if (typeof raw === "string") {
					const parsed = JSON.parse(raw || "[]");
					currentBlacklist = Array.isArray(parsed) ? parsed : [];
				} else if (Array.isArray(raw)) {
					currentBlacklist = raw;
				} else if (typeof raw === "number") {
					currentBlacklist = [raw];
				} else {
					currentBlacklist = [];
				}
			} catch {
				currentBlacklist = [];
			}

			if (!currentBlacklist.includes(props.entityId)) {
				let tightConnection = rows[0].tight_connection;
				if (tightConnection === props.entityId) tightConnection = undefined;

				let currentLooseConnections;
				try {
					const raw = rows[0].loose_connection;

					if (typeof raw === "string") {
						const parsed = JSON.parse(raw || "[]");
						currentLooseConnections = Array.isArray(parsed) ? parsed : [];
					} else if (Array.isArray(raw)) {
						currentLooseConnections = raw;
					} else if (typeof raw === "number") {
						currentLooseConnections = [raw];
					} else {
						currentLooseConnections = [];
					}
				} catch {
					currentLooseConnections = [];
				}

				currentLooseConnections = currentLooseConnections.filter((connection) => connection !== props.entityId);

				currentBlacklist.push(props.entityId);
				await connection.query(`UPDATE ${table} SET blacklist = ?, tight_connection = ?, loose_connection = ? WHERE ${idColumn} = ?`, [
					JSON.stringify(currentBlacklist),
					tightConnection,
					JSON.stringify(currentLooseConnections),
					blacklistedId,
				]);
			}
		}

		const [allEntities] = await connection.query<any[]>(`SELECT ${idColumn}, blacklist FROM ${table}`);

		for (const entity of allEntities) {
			const otherId = entity[idColumn];
			if (props.blacklistEntitiesIds.includes(otherId)) continue;

			let otherBlacklist: number[] = [];

			try {
				const raw = entity.blacklist;

				if (typeof raw === "string") {
					const parsed = JSON.parse(raw || "[]");
					otherBlacklist = Array.isArray(parsed) ? parsed : typeof parsed === "number" ? [parsed] : [];
				} else if (Array.isArray(raw)) {
					otherBlacklist = raw;
				} else if (typeof raw === "number") {
					otherBlacklist = [raw];
				}
			} catch {
				otherBlacklist = [];
			}

			if (otherBlacklist.includes(props.entityId)) {
				const newBlacklist = otherBlacklist.filter((id: number) => id !== props.entityId);
				await connection.query(`UPDATE ${table} SET blacklist = ? WHERE ${idColumn} = ?`, [JSON.stringify(newBlacklist), otherId]);
			}
		}

		await connection.commit();
		connection.release();

		return {
			status: GenEnum.SUCCESS,
			message: `Blacklist ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněn`,
		};
	} catch (error) {
		await connection.rollback();
		connection.release();
		console.error("Database error: " + error);
		return {
			status: GenEnum.FAILURE,
			message: `Nastala chyba během změny blacklistu ${props.entityIsExercise ? "cviku" : "kategorie"}`,
		};
	}
};
