"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "playurl",
    description: "play a song using a video URL from a Youtube video.",
    execute: function (message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var ytdl, yts, videourl, urlsearch, videosr, videopu, songInfo, song, connection, ytdispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ytdl = require("ytdl-core");
                        yts = require("yt-search");
                        console.log(args);
                        videourl = args[0];
                        if (!message.member.voice.channel) {
                            message.channel.send("You must be in a voice channel.");
                            return [2];
                        }
                        else if (!videourl) {
                            message.channel.send("you must specify a youtube link");
                            console.log("denied: args[0] isn't defined");
                            return [2];
                        }
                        else if (!videourl.startsWith("https://")) {
                            message.channel.send("You must send a youtube link.");
                            return [2];
                        }
                        return [4, yts(videourl)];
                    case 1:
                        urlsearch = _a.sent();
                        videosr = urlsearch.all;
                        videopu = videosr[0];
                        return [4, ytdl.getInfo(videourl).catch(console.error)];
                    case 2:
                        songInfo = _a.sent();
                        if (!songInfo) {
                            console.log("denied: varied error => check details above");
                            message.channel.send("Error desu");
                            return [2];
                        }
                        song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                        };
                        return [4, message.member.voice.channel.join()];
                    case 3:
                        connection = _a.sent();
                        connection.voice.setSelfDeaf(true);
                        ytdispatcher = connection.play(ytdl(videourl));
                        ytdispatcher.on("start", function () {
                            message.channel.send({
                                embed: {
                                    color: "ffffff",
                                    title: "You are now playing: `" + song.title + "`",
                                    thumbnail: {
                                        url: videopu.thumbnail,
                                    },
                                    fields: [
                                        {
                                            name: "**Duration:**",
                                            value: "`" + videopu.timestamp + "`",
                                        },
                                        {
                                            name: "**Author:**",
                                            value: videopu.author.name,
                                        },
                                        {
                                            name: "Uploaded:",
                                            value: videopu.ago,
                                        },
                                    ],
                                },
                            });
                            ytdispatcher.on("error", console.error);
                        });
                        ytdispatcher.on("finish", function () {
                            message.channel.send("The song has been ended!");
                            message.guild.me.voice.channel.leave();
                            ytdispatcher.on("error", console.error);
                        });
                        return [2];
                }
            });
        });
    },
};
