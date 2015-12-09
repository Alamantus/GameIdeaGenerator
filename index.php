<?php
$version = "2.0";
$debug = isset($_GET['debug']) ? true : "";

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Insanity Jam Official Game Idea Generator, v. <?php echo $version ?></title>
    <meta name="description" content="Custom-built Idea Generator for use in the quarterly Insanity Jam game development jam.">
    <meta name="author" content="Alamantus GameDev, gamedev@alamantus.com">
    <meta name="web_author" content="Alamantus GameDev, gamedev@alamantus.com">
    <meta name="robots" content="index, nofollow" />
    <meta name="language" content="english">
    <meta name="reply-to" content="gamedev@alamantus.com">
  
    <!-- Bootstrap -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">
	
	<!-- Custom styles for this template -->
    <link href="/css/jumbotron-custom.css" rel="stylesheet">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
  <script src="js/jquery-1.11.0.min.js"></script>
  <script src="/js/bootstrap.min.js"></script>
  <script src="js/seedrandom.min.js"></script>
</head>

<body>
<div class="container">
<?php require "$root/includes/header.php"; ?>
<div class="row marketing">
<div class="panel panel-primary">
	<div class="panel-heading">
		<h2 class="center-block text-center">Insanity Jam Official Game Idea Generator<br />v. <?php echo $version ?></h2>
	</div>
	<div class="panel-body">
		<form id="setseed" method="post">
		<div class="center-block text-center" id="seedentry">Seed: <input id="seedbox" name="seed" value="" onclick="this.select()" onkeydown="if (event.keyCode == 13) {PlaceIdeaOnPage(false, '<?php echo $debug; ?>'); return false;}" /> <strong id="seedchange" class="clickable" onclick="PlaceIdeaOnPage(false, '<?php echo $debug; ?>');">Generate!</strong>
		</div>
		
		<div class="center-block text-center" id="genreoptions" style="display:none;">
        <label>Lock Genre: <select id="genredropdown" onchange="PlaceIdeaOnPage(false, '<?php echo $debug; ?>');"><option value=""></option></select></label><br />
        <small>(Leave blank to randomize)</small><br />
		<label>Remove Genre <input name="genreremove" id="remove" class="clickable" type="checkbox" onclick="removeTheGenre();PlaceIdeaOnPage(false, '<?php echo $debug; ?>');" /></label>
		</div>
		
		<div class="center-block text-center" id="rerollbox"><img id="reroll" class="clickable" src="images/dice.png" onclick="PlaceIdeaOnPage(true, '<?php echo $debug; ?>');" title="Re-Roll" />
		</div>
		</form>

		<div class="well well-lg bg-bright-green center-block" id="ideabox">
			<p class="center-block text-center" id="ideatext" onclick="selectText('ideatext')">
			<span class="clickable" onclick="PlaceIdeaOnPage(true, '<?php echo $debug; ?>');">Click the Dice or Enter a Seed to Generate!</span>
			</p>
			<p id="details"></p>
		</div>
		
		<div class="panel panel-default center-block" id="historybox">
			<a data-toggle="collapse" href="#historyCollapse">
			<div class="panel-heading" id="historyHeader">
				<h3 class="panel-title center-block text-center">
					History
				</h3>
			</div>
			</a>
			<div id="historyCollapse" class="panel-collapse collapse">
				<div class="panel-body" id="history">
				</div>
			</div>
		</div>	<!--History Box -->
		
		<div class="spacer"></div>
		<div class="spacer"></div>
		<div class="spacer"></div>
		
		<div class="panel panel-default center-block" id="hintbox">
			<div class="panel-heading" id="hint">
				<h3 class="panel-title center-block text-center">Random Info:</h3>
			</div>
			<div class="panel-body">
				<p class="center-block text-center" id="hinttext"></p>
			</div>
			<div class="panel-footer">
				<span class="center-block text-center clickable" id="newhint" onclick="javascript:getNewHint();">Get Another!</span>
			</div>
		</div>	<!--Hint Box -->
		
	</div>
	<div class="panel-footer">
		<?php include "$root/includes/generator_footer.php"; ?>
	</div>
</div>	<!--Primary Panel-->
</div>	<!--Row-->

<script src="js/pagescripts.min.js"></script>
<script src="js/generator.min.js"></script>
<?php
	require "$root/includes/foot.php";
?>