<div>
  <div id="inops-node-stats-list"></div>
</div>


<script type="text/html" id="inops-node-stats-item-tpl">
{[~it.items :v]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">{[=v.data.options.title]}</div>
  <div id="inops-node-stats-{[=v.target]}" class="incp-card-body">loading ...</div>
</div>
</div>
</div>
{[~]}
</script>

<script type="text/html" id="inops-node-optools-stats">
<li>the Last</li>
<li>
  <a href="#" value="3600" onclick="inOpsHost.NodeStatsButton(this)" class="valueui-nav-item">
    Hour
  </a>
</li>
<li>
  <a href="#" value="86400" onclick="inOpsHost.NodeStatsButton(this)" class="valueui-nav-item hover">
    24 Hours
  </a>
</li>
<li>
  <a href="#" value="259200" onclick="inOpsHost.NodeStatsButton(this)" class="valueui-nav-item">
    3 Days
  </a>
</li>
<li>
  <a href="#" value="864000" onclick="inOpsHost.NodeStatsButton(this)" class="valueui-nav-item">
    10 Days
  </a>
</li>
<li>
  <a href="#" value="2592000" onclick="inOpsHost.NodeStatsButton(this)" class="valueui-nav-item">
    30 Days
  </a>
</li>
</script>


