import express from "express";
import T from "../../config/twitConfig";
import {jsonResponse} from "../../src/utils/utils";
import {Stream} from "twit";
import {ioServer} from "../../server";
import {Platforms} from "../../src/types/enums";
import {restartServer} from "./api-utils/apiUtils";

const feedRouter = express.Router();

//global variable for Twitter stream
let stream: Stream | null = null;

feedRouter.post("/start", async (req, res) => {
	try {
		const {hashtag} = req.body;

		stream?.stop();

		stream = T.stream("statuses/filter", {track: hashtag ?? "#BACKUPHASHTAG"});

		console.log("Stream has been started.");

		const emittedEvent = `${Platforms.twitter}_${hashtag}`;

		stream.on("tweet", tweet => {
			console.log("Emitting tweet!");
			ioServer.emit(emittedEvent, {tweet});
		});

		res.status(200).json(
			jsonResponse(
				true,
				JSON.stringify({
					message: "Stream has started as is emitting !",
					hashtag,
					emittedEvent,
				})
			)
		);
	} catch (e) {
		console.log(e);
		res.status(404).json(
			jsonResponse(false, JSON.stringify({message: "Couldn't connect to the feed server."}))
		);
	}
});

feedRouter.get("/stop", async (req, res) => {
	try {
		if (!stream) {
			res.status(404).json(
				jsonResponse(false, JSON.stringify({message: "No stream is active."}))
			);
			return;
		}

		stream.stop();

		console.log("Stream has been stopped.");

		res.status(200).json(
			jsonResponse(true, JSON.stringify({message: "Stream has been stopped!"}))
		);

		restartServer();
	} catch (e) {
		console.log(e);
		res.status(404).json(
			jsonResponse(
				false,
				JSON.stringify({message: "Something went wrong while stopping the feed server."})
			)
		);
	}
});

export default feedRouter;
