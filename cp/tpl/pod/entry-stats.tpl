<div id="incp-podentry-index">
  <div id="incp-podentry-stats-list"></div>
</div>

<script type="text/html" id="incp-podentry-stats-item-tpl">
{[~it.items :v]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">{[=v.data.options.title]}</div>
  <div id="incp-podentry-stats-{[=v.target]}" class="incp-card-body">loading ...</div>
</div>
</div>
</div>
{[~]}
</script>

<script type="text/html" id="incp-podentry-optools-stats">
<li>the Last</li>
<li>
  <a href="#" value="3600" onclick="inCpPod.EntryStatsButton(this)" class="l4i-nav-item hover">
    Hour
  </a>
</li>
<li>
  <a href="#" value="86400" onclick="inCpPod.EntryStatsButton(this)" class="l4i-nav-item">
    24 Hours
  </a>
</li>
<li>
  <a href="#" value="259200" onclick="inCpPod.EntryStatsButton(this)" class="l4i-nav-item">
    3 Days
  </a>
</li>
<li>
  <a href="#" value="864000" onclick="inCpPod.EntryStatsButton(this)" class="l4i-nav-item">
    10 Days
  </a>
</li>
</script>


