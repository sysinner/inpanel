<div id="incp-podentry-index">
  <div id="incp-podentry-stats-list"></div>
</div>

<script type="text/html" id="incp-podentry-stats-item-tpl">
{[? it.pod.operate.replicas && it.pod.operate.replica_cap > 1]}
<div class="incp-div-light _incp-body-frame">
<div class="incp-card-frame-row">
  <ul class="incp-nav">
    <li class="incp-topbar-brand" style="padding-left: 20px">Replicas</li>
  </ul>
  <ul class="incp-nav incp-nav-item-underline">
    <li>
      <a href="#" class="l4i-nav-item {[? it._pod_rep_id == -1]}active{[?]}"
        onclick="inCpPod.EntryStats(null, -1)">All</a>
    </li>
    {[~it.pod.operate.replicas :v]}
    <li>
      <a href="#" class="l4i-nav-item {[? v.rep_id == it._pod_rep_id]}active{[?]}"
        onclick="inCpPod.EntryStats(null, {[=v.rep_id]})">{[=v.rep_id]}</a>
    </li>
    {[~]}
  </ul>
</div>
</div>
{[?]}

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


