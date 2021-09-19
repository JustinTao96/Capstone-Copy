/**
 * Created by rtholmes on 2016-06-19.
 */

import fs = require("fs");
import restify = require("restify");
import { InsightDatasetKind, InsightResponse } from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import Log from "../Util";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private static facade: InsightFacade = new InsightFacade();

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.
    private static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        try {
            const response = Server.performEcho(req.params.msg);
            // Log.info("Server::echo(..) - responding " + 200);
            res.json(200, { result: response });
        } catch (err) {
            // Log.error("Server::echo(..) - responding 400");
            res.json(400, { error: err });
        }
        return next();
    }

    private static performEcho(msg: string): string {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        } else {
            return "Message not provided";
        }
    }

    private static async AddDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("Server::AddDataset(..) - params: " + JSON.stringify(req.params));
        try {

            const facade = Server.facade;
            // Log.test("this is the request: " + "\n" + req);

            const id: string = req.params.id;
            const stringKind: string = req.params.kind;
            let kind: InsightDatasetKind;
            const content = req.body.toString("base64");

            if (stringKind.toLowerCase() === "courses") {
                kind = InsightDatasetKind.Courses;

            } else if (stringKind.toLowerCase() === "rooms") {
                kind = InsightDatasetKind.Rooms;

            } else {
                res.json(400, { error: "the kind must be either 'courses' or 'rooms' " });
            }

            const response: InsightResponse = await facade.addDataset(id, content, kind);

            // Log.info("Server::AddDataset(..) - responding " + response.code);
            res.json(response.code, { result: response.body });
        } catch (err) {
            // Log.error("Server::AddDataset(..) - responding 400");
            res.json(400, { error: err });
        }
        return next();
    }

    private static async RemoveDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("Server::RemoveDataset(..) - params: " + JSON.stringify(req.params));
        try {

            // Log.test("this is the request: " + "\n" + req);
            const facade: InsightFacade = Server.facade;
            const id: string = req.params.id;

            const response: InsightResponse = await facade.removeDataset(id);

            // Log.info("Server::RemoveDataset(..) - responding " + response.code);
            res.json(response.code, { result: response.body });
        } catch (err) {
            // Log.error("Server::RemoveDataset(..) - responding 400");
            res.json(400, { error: err });
        }
        return next();
    }

    private static async PerformQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("Server::PerformQuery(..) - params: " + JSON.stringify(req.params));
        try {

            // Log.test("this is the request: " + "\n" + req);
            // Log.test("this is the request body: " + "\n" + req.body);

            const facade: InsightFacade = Server.facade;

            const query: string = String(req.body);
            // Log.test("this is the query: " + "\n" + query);

            const response: InsightResponse = await facade.performQuery(query);

            // Log.info("Server::PerformQuery complete(..) - responding " + response.code);
            // Log.info("Server::PerformQuery complete(..) - response: " + JSON.stringify(response.body));
            res.json(response.code, response.body);
        } catch (err) {
            // Log.error("Server:: catch PerformQuery(..) - responding 400. err: " + err);
            res.json(400, { error: err });
        }
        return next();
    }

    private static async ListDatasets(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("Server::ListDatasets(..) - params: " + JSON.stringify(req.params));
        try {

            // Log.test("this is the request: " + "\n" + req);

            const facade: InsightFacade = Server.facade;

            const response: InsightResponse = await facade.listDatasets();

            // Log.info("Server::ListDatasets complete(..) - responding " + response.code);
            // Log.info("Server::ListDatasets complete(..) - response body: " + response.body);
            res.json(response.code, { result: response.body });
        } catch (err) {
            // Log.error("Server:: catch ListDatasets(..) - responding 400. err: " + err);
            res.json(400, { error: err });
        }
        return next();
    }

    private static getStatic(req: restify.Request, res: restify.Response, next: restify.Next) {
        const publicDir = "frontend/public/";
        // Log.trace("RoutHandler::getStatic::" + req.url);
        let path = publicDir + "index.html";
        if (req.url !== "/") {
            path = publicDir + req.url.split("/").pop();
        }
        fs.readFile(path, function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                // Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

    // CLASS FILES BEGINS HERE:
    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        // Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        // Log.info("Server::close()");
        const that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        const that = this;
        return new Promise(function (fulfill, reject) {
            try {
                // Log.info("Server::start() - start");

                that.rest = restify.createServer({
                    name: "insightUBC",
                });
                that.rest.use(restify.bodyParser({ mapFiles: true, mapParams: true }));
                that.rest.use(
                    function crossOrigin(req, res, next) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        return next();
                    });

                // This is an example endpoint that you can invoke by accessing this URL in your browser:
                // http://localhost:4321/echo/hello
                that.rest.get("/echo/:msg", Server.echo);

                // NOTE: your endpoints should go here
                that.rest.put("/dataset/:id/:kind", Server.AddDataset);

                that.rest.del("/dataset/:id", Server.RemoveDataset);

                that.rest.post("/query", Server.PerformQuery);

                that.rest.get("/datasets", Server.ListDatasets);

                // This must be the last endpoint!
                that.rest.get("/.*", Server.getStatic);

                that.rest.listen(that.port, function () {
                    // Log.info("Server::start() - restify listening: " + that.rest.url);
                    fulfill(true);
                });

                that.rest.on("error", function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal
                    // node not using normal exceptions here
                    // Log.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });

            } catch (err) {
                // Log.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    }
}
