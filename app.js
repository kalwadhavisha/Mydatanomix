const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const CompanyOverview = require("./models/setting-schema");
var numeral = require("numeral");
var moment = require("moment");
let ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const { db } = require("./models/setting-schema");
const { Console } = require("console");
const app = express();
const ejsLint = require("ejs-lint");
var autocomplete = require("autocompleter");
const { userInfo } = require("os");

app.use(express.static("public"));
app.use(morgan("dev"));

const apiKey = "TBFKVIJZT7IK5VTB";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
moment.suppressDeprecationWarnings = true;

const dbURL =
	"mongodb+srv://MadhuHavisha:Mishi1234@cluster0.8etrz.mongodb.net/mydatanomixDB?retryWrites=true&w=majority";

mongoose
	.connect(dbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((resultDB) =>
		app.listen(5000, function () {
			console.log("App listening on port 5000!");
		})
	)
	.catch((err) => console.log(err));

app.get("/", function (req, res) {
	res.render("index", {
		companyName: null,
		companyTicker: null,
		companySector: null,
		companyIndustry: null,
		companyHQ: null,
		companyTrailingPE: null,
		companyForwardPE: null,
		companyAssetType: null,
		companyExchange: null,
		companyLatestQuarter: null,
		companyPERatio: null,
		companyPEGRatio: null,
		companyPriceToSales: null,
		companyPriceToBook: null,
		companyEVToRevenue: null,
		companyEVTOEBITDA: null,
		companyMarketCap: null,
		companyEBITDA: null,
		companyBookValue: null,
		companyRevenuePerShare: null,
		companyProfitMargin: null,
		companyOperatingMargin: null,
		companyReturnOnAssets: null,
		companyReturnOnEquity: null,
		companyRevenue: null,
		companyGrossProfit: null,
		companyDilutedEPS: null,
		companyQuarterlyEarningsYOY: null,
		companyQuarterlyRevenueYOY: null,
		companyBeta: null,
		companySharesOutstanding: null,
		companySharesFloat: null,
		companySharesShort: null,
		companySharesShortPriorMonth: null,
		companyShortRatio: null,
		companyShortPercentOutstanding: null,
		companyShortPercentFloat: null,
		companyPercentInsiders: null,
		companyPercentInstitutions: null,
		companyForwardAnnualDividendRate: null,
		companyForwardAnnualDividendYield: null,
		companyPayoutRatio: null,
		companyDividendDate: null,
		companyExDividendDate: null,
		companyLastSplitFactor: null,
		companyLastSplitDate: null,
		companyDividendPerShare: null,
		companyDividendYield: null,
	});
	console.log("In get");
});

app.get("/viz-page", function (req, res) {
	CompanyOverview.find({}, { Symbol: 1, Name: 1, MarketCapitalization: 1 })
		.sort({
			MarketCapitalization: -1,
		})
		.then((result) => {
			var names = result.map((i) => i.Name);
			var symbols = result.map((i) => i.Symbol);
			var marketCap = result.map((i) => parseFloat(i.MarketCapitalization));
			//console.log(names);
			//console.log(symbols);
			//console.log(marketCap);
			res.render("visualization", {
				compSymbols: symbols,
				compLongNames: names,
				compDataVal: marketCap,
			});
		});
});

app.post("/viz-page", function (req, res) {
	console.log("Data Receiverd Printed  ***************************");
	console.log(req.body.name);
	var subs = req.body.name;
	var dbQueryFind = { Symbol: 1, Name: 1 };
	dbQueryFind[subs] = 1;
	var dbQuerySort = {};
	dbQuerySort[subs] = -1;

	CompanyOverview.find({}, dbQueryFind)
		.sort(dbQuerySort)
		.then((result) => {
			var names = result.map((i) => i.Name);
			var symbols = result.map((i) => i.Symbol);
			var paramValue = result.map((i) => parseFloat(i[subs]));
			//console.log("DATABASE OUTPUT: ");
			//console.log(result);
			//console.log(names);
			//console.log(symbols);
			//console.log(paramValue);

			res.json({
				compSymbols: symbols,
				compLongNames: names,
				compDataVal: paramValue,
			});
		});
});

app.get("/autocomplete/", function (req, res, next) {
	var reqInfo = new RegExp(req.query["term"], "i");
	console.log("Rx data from autocomplete:");
	console.log(reqInfo);

	var compFilter = CompanyOverview.find({ Name: reqInfo }, { Name: 1, Symbol: 1 }).limit(10);
	compFilter.exec(function (err, data) {
		console.log("Data to be sent:");
		console.log(data);
		var result = [];
		if (!err) {
			if (data && data.length && data.length > 0) {
				data.forEach((comp) => {
					let obj = {
						id: comp._id,
						label: comp.Name,
						sym: comp.Symbol,
					};
					result.push(obj);
				});
			}
		}
		console.log("Logging result: --------");
		console.log(result);
		res.jsonp(result);
	});
});

app.get("/company-search", function (req, res) {
	res.render("index", {
		companyName: null,
		companyTicker: null,
		companySector: null,
		companyIndustry: null,
		companyHQ: null,
		companyTrailingPE: null,
		companyForwardPE: null,
		companyAssetType: null,
		companyExchange: null,
		companyLatestQuarter: null,
		companyPERatio: null,
		companyPEGRatio: null,
		companyPriceToSales: null,
		companyPriceToBook: null,
		companyEVToRevenue: null,
		companyEVTOEBITDA: null,
		companyMarketCap: null,
		companyEBITDA: null,
		companyBookValue: null,
		companyRevenuePerShare: null,
		companyProfitMargin: null,
		companyOperatingMargin: null,
		companyReturnOnAssets: null,
		companyReturnOnEquity: null,
		companyRevenue: null,
		companyGrossProfit: null,
		companyDilutedEPS: null,
		companyQuarterlyEarningsYOY: null,
		companyQuarterlyRevenueYOY: null,
		companyBeta: null,
		companySharesOutstanding: null,
		companySharesFloat: null,
		companySharesShort: null,
		companySharesShortPriorMonth: null,
		companyShortRatio: null,
		companyShortPercentOutstanding: null,
		companyShortPercentFloat: null,
		companyPercentInsiders: null,
		companyPercentInstitutions: null,
		companyForwardAnnualDividendRate: null,
		companyForwardAnnualDividendYield: null,
		companyPayoutRatio: null,
		companyDividendDate: null,
		companyExDividendDate: null,
		companyLastSplitFactor: null,
		companyLastSplitDate: null,
		companyDividendPerShare: null,
		companyDividendYield: null,
	});
	//console.log("In get");
});

app.post("/company-search", function (req, res) {
	console.log("In post");
	const compName = req.body.searchBar;
	console.log(compName);
	console.log({ Name: compName });
	CompanyOverview.find({ Name: compName })
		.then((result) => {
			res.render("index", {
				companyName: result[0].Name,
				companyTicker: result[0].Symbol,
				companySector: result[0].Sector,
				companyIndustry: result[0].Industry,
				companyHQ: result[0].Address,
				companyTrailingPE: result[0].TrailingPE,
				companyForwardPE: result[0].ForwardPE,
				companyAssetType: result[0].AssetType,
				companyExchange: result[0].Exchange,
				companyLatestQuarter: moment(result[0].LatestQuarter).format("LL"),
				companyPERatio: result[0].PERatio,
				companyPEGRatio: result[0].PEGRatio,
				companyPriceToSales: result[0].PriceToSalesRatioTTM,
				companyPriceToBook: result[0].PriceToBookRatio,
				companyEVToRevenue: result[0].EVToRevenue,
				companyEVTOEBITDA: result[0].EVToEBITDA,
				companyMarketCap: numeral(result[0].MarketCapitalization)
					.format("(0.000 a)")
					.toUpperCase(),
				companyEBITDA: numeral(result[0].EBITDA).format("(0.000 a)").toUpperCase(),
				companyBookValue: result[0].BookValue,
				companyEPS: result[0].EPS,
				companyRevenuePerShare: parseFloat(result[0].RevenuePerShareTTM),
				companyProfitMargin: numeral(result[0].ProfitMargin).format("(0.000 %)"),
				companyOperatingMargin: numeral(result[0].OperatingMarginTTM).format("(0.000 %)"),
				companyReturnOnAssets: numeral(result[0].ReturnOnAssetsTTM).format("(0.000 %)"),
				companyReturnOnEquity: numeral(result[0].ReturnOnEquityTTM).format("(0.000 %)"),
				companyRevenue: numeral(result[0].RevenueTTM).format("(0.000 a)").toUpperCase(),
				companyGrossProfit: numeral(result[0].GrossProfitTTM)
					.format("(0.000 a)")
					.toUpperCase(),
				companyDilutedEPS: result[0].DilutedEPSTTM,
				companyQuarterlyEarningsYOY: numeral(result[0].QuarterlyEarningsGrowthYOY).format(
					"(0.000 %)"
				),
				companyQuarterlyRevenueYOY: numeral(result[0].QuarterlyRevenueGrowthYOY).format(
					"(0.000 %)"
				),
				companyBeta: result[0].Beta,
				companySharesOutstanding: numeral(result[0].SharesOutstanding)
					.format("(0.000 a)")
					.toUpperCase(),
				companySharesFloat: numeral(result[0].SharesFloat)
					.format("(0.000 a)")
					.toUpperCase(),
				companySharesShort: numeral(result[0].SharesShort)
					.format("(0.000 a)")
					.toUpperCase(),
				companySharesShortPriorMonth: numeral(result[0].SharesShortPriorMonth)
					.format("(0.000 a)")
					.toUpperCase(),
				companyShortRatio: result[0].ShortRatio,
				companyShortPercentOutstanding: result[0].ShortPercentOutstanding,
				companyShortPercentFloat: result[0].ShortPercentFloat,
				companyPercentInsiders: result[0].PercentInsiders,
				companyPercentInstitutions: result[0].PercentInstitutions,
				companyForwardAnnualDividendRate: result[0].ForwardAnnualDividendRate,
				companyForwardAnnualDividendYield: result[0].ForwardAnnualDividendYield,
				companyPayoutRatio: result[0].PayoutRatio,
				companyDividendDate: moment(result[0].DividendDate).format("LL"),
				companyExDividendDate: moment(result[0].ExDividendDate).format("LL"),
				companyLastSplitFactor: result[0].LastSplitFactor,
				companyLastSplitDate: moment(result[0].LastSplitDate).format("LL"),
				companyDividendPerShare: result[0].DividendPerShare,
				companyDividendYield: result[0].DividendYield,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});
// ************************************************************
/*
app.post("/company-search", function (req, res) {
	console.log("In post");
	const compName = req.body.searchBar.toUpperCase();
	console.log(compName);
	console.log({ Symbol: compName });
	CompanyOverview.find({ Symbol: compName })
		.then((result) => {
			res.render("index", {
				companyName: result[0].Name,
				companyTicker: result[0].Symbol,
				companySector: result[0].Sector,
				companyIndustry: result[0].Industry,
				companyHQ: result[0].Address,
				companyTrailingPE: result[0].TrailingPE,
				companyForwardPE: result[0].ForwardPE,
				companyAssetType: result[0].AssetType,
				companyExchange: result[0].Exchange,
				companyLatestQuarter: moment(result[0].LatestQuarter).format("LL"),
				companyPERatio: result[0].PERatio,
				companyPEGRatio: result[0].PEGRatio,
				companyPriceToSales: result[0].PriceToSalesRatioTTM,
				companyPriceToBook: result[0].PriceToBookRatio,
				companyEVToRevenue: result[0].EVToRevenue,
				companyEVTOEBITDA: result[0].EVToEBITDA,
				companyMarketCap: numeral(result[0].MarketCapitalization).format("(0.000 a)"),
				companyEBITDA: numeral(result[0].EBITDA).format("(0.000 a)"),
				companyBookValue: result[0].BookValue,
				companyEPS: result[0].EPS,
				companyRevenuePerShare: parseFloat(result[0].RevenuePerShareTTM),
				companyProfitMargin: result[0].ProfitMargin,
				companyOperatingMargin: result[0].OperatingMarginTTM,
				companyReturnOnAssets: result[0].ReturnOnAssetsTTM,
				companyReturnOnEquity: result[0].ReturnOnEquityTTM,
				companyRevenue: numeral(result[0].RevenueTTM).format("(0.000 a)"),
				companyGrossProfit: numeral(result[0].GrossProfitTTM).format("(0.000 a)"),
				companyDilutedEPS: result[0].DilutedEPSTTM,
				companyQuarterlyEarningsYOY: result[0].QuarterlyEarningsGrowthYOY,
				companyQuarterlyRevenueYOY: result[0].QuarterlyRevenueGrowthYOY,
				companyBeta: result[0].Beta,
				companySharesOutstanding: numeral(result[0].SharesOutstanding).format("(0.000 a)"),
				companySharesFloat: numeral(result[0].SharesFloat).format("(0.000 a)"),
				companySharesShort: numeral(result[0].SharesShort).format("(0.000 a)"),
				companySharesShortPriorMonth: numeral(result[0].SharesShortPriorMonth).format(
					"(0.000 a)"
				),
				companyShortRatio: result[0].ShortRatio,
				companyShortPercentOutstanding: result[0].ShortPercentOutstanding,
				companyShortPercentFloat: result[0].ShortPercentFloat,
				companyPercentInsiders: result[0].PercentInsiders,
				companyPercentInstitutions: result[0].PercentInstitutions,
				companyForwardAnnualDividendRate: result[0].ForwardAnnualDividendRate,
				companyForwardAnnualDividendYield: result[0].ForwardAnnualDividendYield,
				companyPayoutRatio: result[0].PayoutRatio,
				companyDividendDate: moment(result[0].DividendDate).format("LL"),
				companyExDividendDate: moment(result[0].ExDividendDate).format("LL"),
				companyLastSplitFactor: result[0].LastSplitFactor,
				companyLastSplitDate: moment(result[0].LastSplitDate).format("LL"),
				companyDividendPerShare: result[0].DividendPerShare,
				companyDividendYield: result[0].DividendYield,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});
*/
