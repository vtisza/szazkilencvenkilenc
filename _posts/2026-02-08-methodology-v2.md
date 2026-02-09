---
layout: post
title:  "Detailed Methodology: The 2026 Election Model"
author: Viktor
categories: []
tags: [methodology, "2026", analysis, "English"]
lang: en
image: assets/images/gears.webp
description: "How does the 'Chronicler-v2' election model work? A look under the hood of hierarchical Bayesian estimation and seat allocation."
featured: false
hidden: false
---
With the 2026 parliamentary elections approaching, we have updated our forecasting system. The new model, **"Chronicler-v2"** (Krónikás-v2), applies state-of-the-art statistical methods, specifically [probabilistic programming](https://en.wikipedia.org/wiki/Probabilistic_programming) and hierarchical Bayesian modeling, to estimate expected results.

Below we detail the model's operation, data sources, and algorithms used.

---

## 1. Data Sources

The model's primary input is public opinion poll results. We take these from the [Vox Populi](https://kozvelemeny.org/) election guide database, which is the result of Gábor Tóka's conscientious collection work. The model currently processes polls published since November 2024.

## 2. The Hierarchical Bayesian Model (Polling Aggregation)

Aggregating opinion polls does not mean simple averaging. Different institutes work with different methodologies, at different times, and with different sample sizes. Our model takes all of this into account.

### Major Components:

* **Latent State:** We treat the true social support of parties as a time-varying, hidden (latent) variable. Its movement is described by a **Gaussian Random Walk**. This means today's support starts from yesterday's support but can change by a random amount.
* **House Effects:** We assign a bias parameter to every polling institute. The model learns from the data whether a given institute systematically over- or underestimates certain parties compared to the average (consensus). Since we don't know for sure who is right, we summarize "House Effects" with a common, hierarchical prior distribution.
* **Observation Model:** We model party support using a **Dirichlet distribution**. This multivariate distribution guarantees that the sum of party support is always exactly 100% (the so-called *simplex* constraint), thus avoiding inconsistencies arising from separate modeling.
* **Temporal Uncertainty:** As the election day approaches, uncertainty decreases. The model adds extra variance proportional to the square root of the remaining time to the forecast, so estimates for the distant future are naturally more uncertain ("funnel" effect).

We use **MCMC (Markov Chain Monte Carlo)** sampling for estimation using the `PyMC` library, typically on 4 chains with thousands of samples for convergence.

## 3. Seat Projection

A peculiarity of the Hungarian election system is that the majority of seats (106 out of 199) are decided in individual constituencies (OEVK), where the "winner takes all" principle applies.

### Model Steps:

1. **Base: 2022 Elections:** Since there are no regular constituency-level surveys, we use the 2022 election results as a starting point.
2. **Uniform Swing:** We modify the 2022 results with the change in current national polling averages.
   * *Example:* If Fidesz has weakened by 5 percentage points nationally since 2022, the model reduces Fidesz's expected result by 5 percentage points in every single constituency.
   * This method assumes that the territorial distribution of political mood changes is relatively uniform (although the model includes some random variation between districts to increase uncertainty).
3. **Party Mapping:**
   * **Fidesz-KDNP** → Fidesz-KDNP (unchanged)
   * **United for Hungary (2022)** → The votes of the 2022 opposition coalition are distributed between the **TISZA Party** and **DK** (and the MSZP-Momentum bloc) in proportion to current polls.
   * **Mi Hazánk** → Mi Hazánk (unchanged)
   * **MKKP** → MKKP (unchanged)
4. **System Logic:**
   * **106 Individual Seats:** Based on estimated results per district, the candidate with the most votes wins the seat.
   * **Winner Compensation:** The vote difference between the winning party and the second-placed party (surplus votes) is added to the national list result.
   * **Fractional Votes:** Votes cast for losing candidates also increase the national list.
   * **93 List Seats:** Based on aggregated list votes (national list votes + fractional votes + winner compensation), we allocate seats using the **D'Hondt method**, applying a 5% threshold.
   * **Minority Representative:** The model dedicates 1 seat to the German minority, which based on political analysis is classified with the pro-government bloc.
   * **Mail-in Votes:** The model calculates with approx. 250,000 cross-border mail-in votes, assuming >90% Fidesz support based on past experience.

## 4. Simulation and Results

We handle future uncertainty not with a single estimate, but with **40,000 Monte Carlo simulations**. In all 40,000 cases:

1. We generate a possible election result within statistical margins of error.
2. We run the full election system (districts, list, compensation).
3. We determine the winner and seat ratios.

Thus we get the probabilities – for example, "Chance of Stalemate" or "Chance of TISZA Majority" – that we report in our analyses. This method gives a much more nuanced picture than simple percentages, as it shows the full scale of possible scenarios.

---

*The model is under continuous development. The goal is not to predict the future, but to accurately map current processes and uncertainties on a mathematical basis.*
