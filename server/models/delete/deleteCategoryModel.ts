import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface DeleteCategoryProps {
	sportId: number;
	categoryId: number;
}

export const deleteCategoryModel = async ({ props }: { props: DeleteCategoryProps }): Promise<GenericModelReturn<null>> => {
	try {
		const query = `
            DELETE FROM categories WHERE sport_id = ? AND category_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.categoryId]);

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		return { status: GenericModelReturnEnum.FAILURE, message: "Database error: " + error };
	}
};
