---
id: mountain-path
size: [10, 6]
palette: snow-mountain
---
# Mountain Path

A narrow trail worn into the mountainside by generations of travelers and
pack-goats. Snow piles against the rock walls on either side, and the
path itself is hard-packed dirt dusted with frost.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter |
| terrain:ground.winter | terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter |
| terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter |
| terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter |
| terrain:ground.winter | terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter | terrain:ground.winter | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.winter | terrain:ground.winter |
| terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter | terrain:ground.winter |

### road
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | road | road | road | road | road | road | 0 | 0 |
| 0 | 0 | road | road | road | road | road | road | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### snow
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| snow | snow | snow | 0 | snow | snow | snow | 0 | snow | snow |
| snow | 0 | 0 | 0 | 0 | snow | 0 | 0 | 0 | snow |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| snow | 0 | 0 | 0 | snow | 0 | 0 | 0 | 0 | snow |
| snow | snow | snow | snow | snow | snow | snow | snow | snow | snow |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## Anchors
- entry-west: [0, 3]
- entry-east: [9, 3]

## Objects
- sign-post: object:prop.sign-1-snow @ [1, 1]
