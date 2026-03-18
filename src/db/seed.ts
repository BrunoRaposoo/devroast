import { faker } from "@faker-js/faker";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"c",
	"cpp",
	"csharp",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"sql",
] as const;

const ROAST_FEEDBACKS = [
	"Este código é tão ruim que até o compilador está chorando. Sinceramente, você tentou escrever isso ou foi o teclado que tossiu?",
	"Olha, eu já vi código ruim na minha vida, mas isso aqui... isso é uma obra-prima do caos. Parabéns (não).",
	"Se isso fosse um diagnóstico médico, seria terminal. O código não vai compilar, e se compilar, não vai funcionar.",
	"Você sabe que existe algo chamado 'funções', né? Esse arquivo único de 2000 linhas está me dando ansiedade só de olhar.",
	"Esse código tem mais bugs do que um filme de terror tem jump scares.ibel",
	"Parabéns, você reinventou a roda quadrada. Mas convenhamos, a roda já existia, né?",
	"Eu preciso decaf após ver isso. Meu cérebro está em overload com tanta... 'criatividade'.",
	"Sabe o que seria melhor que esse código? Um hello world. Simples, direto, e não machuca os olhos de ninguém.",
	"Esse padrão de nomenclatura está me fazendo questionar suas escolhas de vida. variable1, variable2, really?",
	"POO? Mais Like OOO - Orientado a Objeto Obscuro. Não sei o que isso faz, e sinceramente, não quero saber.",
	"Você sabe que existem coisas chamadas 'testes', né? Parece que você descobriu o conceito e decidiu ignorá-lo completamente.",
	"Esse código tem mais complexidade ciclomática do que um labirinto. Sério, tem gente que se perde menos no Hogwarts.",
	"Cada linha desse código é uma surpresa. Tipo, 'será que vai dar erro agora?'. E a resposta é sempre sim.",
	"Eu olhei isso e automaticamente desenvolvi dor de cabeça. Sério, vá tomar um café e reconsidere sua vida.",
	"Esse código está tão cheio de code smells que parece que taking um banho seria mais higiênico.",
	"Você sabia que o git tem um comando chamado 'revert'? Sugiro usar. Agora. Por favor.",
	"Esse código é prova de que a educação formal não garante tudo. Por favor, assistam um tutorial.",
	"Sinceramente? Eu preferia ler hieróglifos. Pelo menos eles têm um padrão misteriosamente lógico.",
	"Esse código tem mais comentarios do que lógica. E ainda assim, nenhum dos dois faz sentido.",
	"Você já considerou que talvez programação não seja sua vocação? Tem cursos de culinária, viu?",
];

const GOOD_FEEDBACKS = [
	"Bom trabalho! O código está limpo e bem estruturatual. Apenas considere adicionar mais testes unitários para garantir a robustez.",
	"Boa implementação! O uso de tipagem está correto. Talvez possa extrair algumas funções para melhorar a legibilidade.",
	"Ótimo código! A lógica está clara e eficiente. Sugestão: documentar as funções mais complexas com JSDoc.",
	" Bem feito! O código segue boas práticas. Que tal adicionar tratamento de erros mais robusto?",
	"Boa estrutura! O código está bem organizado. Considere usar constants para valores mágicos.",
	"Excelente trabalho! O código está limpo e manutenível. Uma pequena sugestão: otimizar as queries do banco.",
	"Muito bom! A implementação está sólida. Considere adicionar logs para debugging futuro.",
	"Ótimo código! O uso de typescript está adequado. Apenas alguns pontos de melhoria nos nomes de variáveis.",
	"Boa implementação! O código está funcionando bem. Sugestão: separar as responsabilidades em módulos.",
	"Trabalho bom! O código está funcional. Considere adicionar fallback para casos de erro.",
];

function generateCodeSample(language: string): string {
	switch (language) {
		case "javascript":
			return `function ${faker.lorem.word()}() {
  const ${faker.lorem.word()} = ${faker.number.int({ min: 1, max: 100 })};
  return ${faker.lorem.word()} * 2;
}

${Array.from(
	{ length: faker.number.int({ min: 3, max: 8 }) },
	() =>
		`console.log('${faker.lorem.word()}'${faker.helpers.maybe(() => `, ${faker.lorem.word()}`)});`,
).join("\n")}`;

		case "python":
			return `def ${faker.lorem.word()}_${faker.lorem.word()}():
    ${faker.lorem.word()} = ${faker.number.int({ min: 1, max: 100 })}
    return ${faker.lorem.word()} ** 2

${Array.from(
	{ length: faker.number.int({ min: 3, max: 6 }) },
	() => `print("${faker.lorem.word()}")`,
).join("\n")}`;

		case "typescript":
			return `interface ${faker.lorem.word()} {
  id: number;
  name: string;
}

function ${faker.lorem.word()}(data: ${faker.lorem.word()}): void {
  console.log(data);
}`;

		case "rust":
			return `fn ${faker.lorem.word()}(x: i32) -> i32 {
    x * ${faker.number.int({ min: 2, max: 5 })}
}

fn main() {
    let result = ${faker.lorem.word()}(${faker.number.int({ min: 1, max: 10 })});
    println!("{}", result);
}`;

		case "go":
			return `package main

import "fmt"

func ${faker.lorem.word()}(${faker.lorem.word()} int) int {
    return ${faker.lorem.word()} * 2
}

func main() {
    fmt.Println(${faker.lorem.word()}(${faker.number.int({ min: 1, max: 10 })}));
}`;

		default:
			return `// ${language} code example
function example() {
  // TODO: implement
  return true;
}`;
	}
}

async function seed() {
	console.log("🌱 Starting seed...");

	const submissions = [];
	const results = [];

	for (let i = 0; i < 20; i++) {
		const language = faker.helpers.arrayElement(LANGUAGES);
		const isRoastMode = faker.datatype.boolean();
		const score = Number(faker.number.float({ min: 0.5, max: 9.5 }).toFixed(2));
		const sessionId = faker.string.uuid();

		const [submission] = await db
			.insert(schema.codeSubmissions)
			.values({
				sessionId,
				code: generateCodeSample(language),
				language,
				createdAt: faker.date.past({ years: 1 }),
			})
			.returning({ id: schema.codeSubmissions.id });

		submissions.push(submission.id);

		const feedback = isRoastMode
			? faker.helpers.arrayElement(ROAST_FEEDBACKS)
			: faker.helpers.arrayElement(GOOD_FEEDBACKS);

		const [result] = await db
			.insert(schema.roastResults)
			.values({
				submissionId: submission.id,
				score: score.toString(),
				roastMode: isRoastMode ? "sarcastic" : "constructive",
				feedback,
				createdAt: faker.date.past({ years: 1 }),
			})
			.returning({ id: schema.roastResults.id });

		results.push({ id: result.id, submissionId: submission.id, score });

		await db.insert(schema.leaderboardEntries).values({
			submissionId: submission.id,
			sessionId,
			rank: i + 1,
			score: score.toString(),
			createdAt: faker.date.past({ years: 1 }),
		});
	}

	console.log(`✅ Created ${submissions.length} code submissions`);
	console.log(`✅ Created ${results.length} roast results`);
	console.log(`✅ Created ${submissions.length} leaderboard entries`);
	console.log("🌱 Seed completed!");
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("Seed failed:", err);
		process.exit(1);
	});
