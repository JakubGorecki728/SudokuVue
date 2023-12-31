import type { ParsedTemplate, ValidTemplates } from "@/types/sudoku-parser-types";
import type { ReadableStruct } from "@/types/sudoku-types";
import _ from "lodash";

export class SudokuTemplates {

    private static parseTemplate<Template extends string>(template: Template): ReadableStruct {
        const matches = template.match(/(?<=[│║|]) *[0-9 ] *(?=[│║|])/g)?.map(el => parseInt(el) || 0);
        if (matches?.length !== 81) { throw new Error('Sudoku template cannot be parsed because is invalid') }
        return _.chunk(matches, 9) as ReadableStruct;
    };

    public static getTemplate(index: number) {
        const templates = SudokuTemplates.templates();
        const i = index > templates.length-1 ? templates.length-1 : index < 0 ? 0 : index;
        return {
            index: index,
            length: templates.length,
            template: SudokuTemplates.parseTemplate(templates[i])
        };
    }

    private static validate<T extends readonly string[]>(templates: T) {
        return templates as ValidTemplates<T>;
    }

    private static templates(): readonly string[] {
        return SudokuTemplates.validate(([
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║    │    │    ║ 1  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 6  ║    │    │ 1  ║    │    │ 4  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 8  ║    │    │    ║    │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║    │ 3  │ 4  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 8  │    ║    │ 5  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 2  │ 9  ║    │    │    ║ 6  │    │ 3  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║    │ 1  │ 6  ║ 7  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 9  │    │    ║    │    │ 8  ║    │    │ 6  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 4  │ 3  ║    │ 2  │ 7  ║    │ 8  │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │ 1  ║ 8  │    │ 5  ║ 6  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 9  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 5  │    ║    │    │    ║    │ 2  │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║ 2  │ 8  │    ║    │    │ 4  ║ 9  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │ 3  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │    ║ 8  │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 3  │    ║ 4  │    │    ║    │ 5  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 6  ║ 1  │    │    ║    │ 4  │ 8  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 7  │    │ 8  ║    │    │    ║    │ 9  │ 6  ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║    │    │    ║    │ 5  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 2  │    ║ 1  │    │    ║    │    │ 7  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 4  │ 8  │    ║    │    │    ║    │ 1  │ 6  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 3  │    ║    │ 4  │    ║ 6  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │    ║    │    │ 5  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║ 3  │ 8  │ 1  ║    │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║ 8  │    │    ║ 2  │ 7  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 2  │    │    ║    │ 6  │ 5  ║    │ 4  │ 8  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 7  │ 5  │    ║    │    │    ║    │    │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │ 3  ║    │ 9  │    ║ 4  │    │ 6  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 7  │ 4  │    ║    │    │    ║    │ 1  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 1  ║    │    │ 6  ║    │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 1  │    ║ 5  │ 7  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │ 8  ║ 6  │    │ 1  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 5  │    │    ║    │    │ 3  ║    │ 4  │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║    │ 1  │ 7  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │    ║ 9  │ 2  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 2  │    ║    │ 3  │ 8  ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║    │    │    ║ 6  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 2  │    ║    │    │ 9  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 9  │    ║    │    │ 1  ║ 5  │    │ 3  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║ 4  │    │    ║    │ 2  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 4  │    │    ║    │ 3  │ 5  ║    │    │ 8  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║ 7  │    │    ║    │    │ 6  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 4  │ 8  ║    │ 1  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 1  ║    │    │ 2  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║ 5  │ 6  │ 7  ║ 1  │    │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │ 2  │ 7  ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 5  │    │    ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 3  │    ║    │    │    ║ 2  │    │ 9  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║ 9  │    │    ║    │    │ 8  ║    │    │ 7  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 2  ║    │    │ 7  ║ 4  │ 8  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 8  │    │    ║    │ 6  │    ║    │ 9  │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │ 1  ║ 9  │ 8  │ 3  ║    │ 4  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │ 4  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 6  │    ║    │ 2  │    ║ 7  │    │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │ 6  │    ║    │    │    ║    │ 3  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 1  ║    │    │    ║ 8  │    │ 9  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║ 7  │ 8  │    ║    │ 4  │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║ 7  │ 9  │    ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 8  │    │    ║    │ 3  │ 5  ║ 2  │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║ 1  │    │    ║    │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║ 6  │    │ 9  ║    │ 2  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 3  ║    │ 7  │ 2  ║    │    │ 4  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │ 3  ║    │ 6  │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 5  │ 3  ║    │ 2  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 8  │    │    ║    │    │ 3  ║ 6  │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║ 8  │    │ 4  ║    │    │ 1  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 5  │ 9  ║    │ 2  │ 4  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 7  │    ║    │    │ 2  ║    │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │ 6  ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 1  │ 3  │ 4  ║    │ 7  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 9  │    │    ║ 3  │    │    ║ 8  │    │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║ 9  │    │    ║    │ 8  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 2  │    │    ║ 5  │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 3  │    │ 8  ║    │    │    ║    │ 1  │ 2  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 6  │    ║ 3  │    │ 4  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │ 9  ║ 7  │ 6  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │ 4  ║    │    │    ║    │    │ 1  ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │    │    ║ 6  │ 8  │    ║ 5  │ 2  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 3  │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 7  │ 6  ║    │    │    ║    │    │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
            `
            ╔════╤════╤════╦════╤════╤════╦════╤════╤════╗
            ║    │    │    ║ 6  │    │    ║    │    │ 5  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 1  │    │    ║ 3  │    │    ║ 9  │ 4  │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 8  │    │    ║    │    │    ║ 6  │    │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║    │ 1  │ 5  ║    │    │    ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │ 4  │    ║    │ 7  │ 9  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │ 2  │    ║    │ 5  │    ║    │ 6  │    ║
            ╠════╪════╪════╬════╪════╪════╬════╪════╪════╣
            ║ 9  │    │ 8  ║    │    │ 3  ║    │    │    ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║ 3  │    │    ║    │    │ 1  ║    │    │ 7  ║
            ╟────┼────┼────╫────┼────┼────╫────┼────┼────╢
            ║    │    │    ║    │    │    ║    │ 2  │    ║
            ╚════╧════╧════╩════╧════╧════╩════╧════╧════╝
            `,
        ] as const));
    }
}

