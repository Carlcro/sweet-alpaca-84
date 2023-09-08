import { Handlers, PageProps } from "$fresh/server.ts";
import { randomNumber } from "https://deno.land/x/random_number/mod.ts";

const NAMES = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];

interface Data {
  notes: string[];
}

const kv = await Deno.openKv();

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const note = form.get("note")?.toString() || "";

    const currentNotes = (await kv.get(["note"])).value;

    console.log("currentNotes", currentNotes);

    if (Array.isArray(currentNotes)) {
      const newNots = [...currentNotes, note];
      const ok = await kv.atomic().set(["note"], newNots).commit();
      console.log(ok);
      return ctx.render({ notes: newNots });
    } else {
      const ok = await kv.atomic().set(["note"], [note]).commit();
      console.log(ok);
      return ctx.render({ notes: [note] });
    }
  },
  async GET(_req, ctx) {
    const notes = (await kv.get<string[]>(["note"])).value;

    if (Array.isArray(notes)) {
      return ctx.render({ notes });
    } else {
      return ctx.render({ notes: [] });
    }
  },
};

export default function Page({ data }: PageProps<Data>) {
  return (
    <div class="w-full flex justify-center flex-row space-x-6 pt-5">
      <form class="flex  flex-col mb-5" method="post">
        <input class="border" type="text" name="note" value="" />
        <button type="submit">Save</button>
      </form>
      <div>
        {data.notes.reverse().map((n) => (
          <div>{n}</div>
        ))}
      </div>
    </div>
  );
}
