import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HttpModule } from './interfaces/http/mod.ts';

const app = new Hono();

app.use('*', logger());

app.route('api', new HttpModule().init());

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

Deno.serve(app.fetch);
