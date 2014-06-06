<?php
$version = "0.9";
$debug = isset($_GET['debug']) ? true : "";
$seed = isset($_POST['seed']) ? htmlspecialchars($_POST['seed']) : (string)rand();
$genrelock = isset($_POST['genrelock']) ? $_POST['genrelock'] : 'off';
$genreremove = isset($_POST['genreremove']) ? $_POST['genreremove'] : 'off';
$genre = isset($_POST["lockedgenre"]) ? $_POST["lockedgenre"] : "";
if ($seed == "") {
	$seed = (string)rand();
}

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
?>
<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Insanity Jam Official Game Idea Generator, v. <?php echo $version ?></title>
  <meta name="description" content="Custom-built Idea Generator for use in the semi-anual Insanity Jam game development jam.">
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
  <script src="js/seedrandom.min.js"></script>
  <script src="js/pagescripts.js"></script>
  <script src="js/generator.js"></script>
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
		<div class="center-block text-center" id="seedentry">Seed: <input id="seedbox" name="seed" value="<?php echo $seed; ?>" onclick="this.select()" /> <input id="seedchange" type="submit" value="Generate!" />
		<br /><small class="clickable" onclick="javascript:$('#rescuedseed').toggleClass('hidden');">(Click here if the box is blank to recover the seed.)</small><br />
		<span id="rescuedseed" class="hidden" onclick="selectText('rescuedseed')"><?php echo $seed; ?></span>
		</div>
		
		<div class="center-block text-center" id="genreoptions">
		<div id="lockoption" style="display:inline;">Lock Genre <input name="genrelock" id="lock" type="checkbox" onclick="if(this.checked){document.getElementById('remove').checked=false;var g=document.getElementById('genre').innerHTML; if (g!=null) {document.getElementById('genreplaceholder').innerHTML='<input type=\'hidden\' id=\'genrefield\' name=\'lockedgenre\' value=\'' + g + '\' />';}}else{document.getElementById('genreplaceholder').innerHTML='';}" /></div><span id="genreplaceholder"></span>
		&nbsp;&nbsp;&nbsp;Remove Genre <input name="genreremove" id="remove" type="checkbox" onclick="if(this.checked){document.getElementById('lock').checked=false;document.getElementById('genreplaceholder').innerHTML = '';}" />
		</div>
		
		<div class="center-block text-center" id="rerollbox"><input id="reroll" type="image" src="images/dice.png" name="submit" onclick="document.getElementById('seedbox').value='';" title="Re-Roll">
		</div>
		</form>

		<div class="well well-lg bg-bright-green center-block" id="ideabox">
			<p class="center-block text-center" id="ideatext" onclick="selectText('ideatext')">
			<script>
				PlaceIdeaOnPage('<?php echo $seed; ?>', '<?php echo $genre; ?>', '<?php echo $genreremove; ?>', 'ideatext', '<?php echo $debug; ?>');
			</script>
			</p>
			<p id="details"></p>
		</div>
		
		<div class="panel panel-default center-block" id="historybox">
			<div class="panel-heading" id="historyHeader">
				<h3 class="panel-title center-block text-center">
					<a data-toggle="collapse" href="#historyCollapse">
					History
					</a>
				</h3>
			</div>
			<div id="historyCollapse" class="panel-collapse collapse">
				<div class="panel-body" id="history">
					<script>
						setAndShowHistory('<?php echo $seed; ?>', '<?php echo $genre; ?>', '<?php echo $genreremove; ?>');
					</script>
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
		<p>Problem with the generator? Idea for the generator? Report it to the <a href="https://bitbucket.org/alamantusgamedev/game-idea-generator" target="_blank">Issue Tracker</a>!</p>
	</div>
</div>	<!--Primary Panel-->
</div>	<!--Row-->

<script>
	pageLoadFunctions('<?php echo $genrelock; ?>', '<?php echo $genre; ?>', '<?php echo $genreremove; ?>');
</script>

<?php
	require "$root/includes/foot.php";
?>