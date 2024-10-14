import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    const { uuid } = params;

    return {
        uuid,
    };
};
