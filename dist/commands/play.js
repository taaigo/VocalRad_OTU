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
    name: "play",
    description: "Allows you to play a song using it's name.",
    execute: function (message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var ytdl, yts, videoArs, video, searchUrl, searchTitle, err_1, connection, searchdispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ytdl = require('ytdl-core');
                        yts = require('yt-search');
                        if (!message.member.voice.channel) {
                            message.channel.send('You must be in a voice channel.');
                            return [2];
                        }
                        else if (!args[0]) {
                            message.channel.send("Please name a video");
                            console.log("denied: args[0] isn't defined");
                            return [2];
                        }
                        else if (args[0].startsWith('https://')) {
                            message.channel.send('Please use the `playurl` command if you want to use a link.');
                            console.log('denied: args[0] is a link.');
                            return [2];
                        }
                        else if (args[0].startsWith('http://')) {
                            message.channel.send('Please use the `playurl` command if you want to use a link.');
                            console.log('denied: args[0] is a link.');
                            return [2];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, yts(args.join(" "))];
                    case 2:
                        videoArs = _a.sent();
                        video = videoArs.all;
                        searchUrl = video[0].url;
                        searchTitle = video[0].title;
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        message.channel.send('Error desu');
                        return [2];
                    case 4:
                        console.log("video found:\n\n            title: " + video[0].title + "\n            description: " + video[0].description + "\n            timestamp: " + video[0].timestamp + "\n            videoId: " + video[0].videoId + "\n            url: " + video[0].url + "\n            ago: " + video[0].ago + "\n            ");
                        return [4, message.member.voice.channel.join()];
                    case 5:
                        connection = _a.sent();
                        connection.voice.setSelfDeaf(true);
                        searchdispatcher = connection.play(ytdl(searchUrl));
                        searchdispatcher.on('start', function () {
                            message.channel.send({ embed: {
                                    color: "ffffff",
                                    title: "You are now playing: `" + searchTitle + "`",
                                    thumbnail: {
                                        url: video[0].thumbnail
                                    },
                                    fields: [
                                        {
                                            name: "**Duration:**",
                                            value: "`" + video[0].timestamp + "`"
                                        },
                                        {
                                            name: "**Author:**",
                                            value: video[0].author.name
                                        },
                                        {
                                            name: "Uploaded:",
                                            value: video[0].ago
                                        }
                                    ]
                                }
                            });
                            searchdispatcher.on('error', console.error);
                        });
                        searchdispatcher.on('finish', function () {
                            message.channel.send('The song has been ended!');
                            message.guild.me.voice.channel.leave();
                            searchdispatcher.on('error', console.error);
                        });
                        return [2];
                }
            });
        });
    }
};
